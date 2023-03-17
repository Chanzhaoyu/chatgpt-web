package main

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"net/http"
	"net/url"
	"os"
	"strings"

	"github.com/gorilla/mux"
	openai "github.com/sashabaranov/go-openai"

	"github.com/skrashevich/chatgpt-web/goservice/chatgpt"
)

type ChatRequest struct {
	Prompt  string             `json:"prompt"`
	Options ChatRequestOptions `json:"options,omitempty"`
}
type ChatRequestOptions struct {
	ParentMessageId string `json:"parentMessageId"`
}

type VerifyRequest struct {
	Token string `json:"token"`
}

var openAIKey string

func chatProcessHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/octet-stream")

	var req ChatRequest
	err := json.NewDecoder(r.Body).Decode(&req)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	if openAIKey == "" {
		panic(errors.New("Missing OPENAI_API_KEY environment variable"))
	}

	config := openai.DefaultConfig(openAIKey)
	socksHost := os.Getenv("SOCKS_PROXY_HOST")
	socksPort := os.Getenv("SOCKS_PROXY_PORT")
	httpsProxy := os.Getenv("HTTPS_PROXY")

	if socksHost != "" && socksPort != "" {
		proxyUrl, err := url.Parse("socks5://" + socksHost + ":" + socksPort)
		if err != nil {
			panic(err)
		}
		transport := &http.Transport{
			Proxy: http.ProxyURL(proxyUrl),
		}
		config.HTTPClient = &http.Client{
			Transport: transport,
		}
	} else if httpsProxy != "" {
		proxyUrl, err := url.Parse("https://" + httpsProxy)
		if err != nil {
			panic(err)
		}
		transport := &http.Transport{
			Proxy: http.ProxyURL(proxyUrl),
		}
		config.HTTPClient = &http.Client{
			Transport: transport,
		}
	}

	chatgpt := openai.NewClientWithConfig(config)

	resp, err := chatgpt.CreateChatCompletion(
		context.Background(),
		openai.ChatCompletionRequest{
			Model: openai.GPT3Dot5Turbo,
			Messages: []openai.ChatCompletionMessage{
				{
					Role:    openai.ChatMessageRoleUser,
					Content: "Hello!",
				},
			},
		},
	)

	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

}

func configHandler(w http.ResponseWriter, r *http.Request) {
	response, err := chatConfig()
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	json.NewEncoder(w).Encode(response)
}

func sessionHandler(w http.ResponseWriter, r *http.Request) {
	authSecretKey := os.Getenv("AUTH_SECRET_KEY")
	hasAuth := authSecretKey != ""

	response := struct {
		Status  string `json:"status"`
		Message string `json:"message"`
		Data    struct {
			Auth  bool   `json:"auth"`
			Model string `json:"model"`
		} `json:"data"`
	}{
		Status:  "Success",
		Message: "",
		Data: struct {
			Auth  bool   `json:"auth"`
			Model string `json:"model"`
		}{
			Auth:  hasAuth,
			Model: currentModel(),
		},
	}

	json.NewEncoder(w).Encode(response)
}

func verifyHandler(w http.ResponseWriter, r *http.Request) {
	var req VerifyRequest
	err := json.NewDecoder(r.Body).Decode(&req)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	if req.Token == "" {
		http.Error(w, "Secret key is empty", http.StatusBadRequest)
		return
	}

	if os.Getenv("AUTH_SECRET_KEY") != req.Token {
		http.Error(w, "Secret key is invalid", http.StatusBadRequest)
		return
	}

	response := struct {
		Status  string      `json:"status"`
		Message string      `json:"message"`
		Data    interface{} `json:"data"`
	}{
		Status:  "Success",
		Message: "Verify successfully",
		Data:    nil,
	}

	json.NewEncoder(w).Encode(response)
}
func authMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		authSecretKey := os.Getenv("AUTH_SECRET_KEY")
		if authSecretKey != "" {
			authorization := r.Header.Get("Authorization")
			if authorization == "" || strings.TrimSpace(strings.TrimPrefix(authorization, "Bearer ")) != strings.TrimSpace(authSecretKey) {
				response := struct {
					Status  string      `json:"status"`
					Message string      `json:"message"`
					Data    interface{} `json:"data"`
				}{
					Status:  "Unauthorized",
					Message: "Error: 无访问权限 | No access rights",
					Data:    nil,
				}
				w.WriteHeader(http.StatusUnauthorized)
				json.NewEncoder(w).Encode(response)
				return
			}
		}

		next.ServeHTTP(w, r)
	})
}

func main() {
	openAIKey = os.Getenv("OPENAI_API_KEY")

	r := mux.NewRouter()

	r.HandleFunc("/chat-process", chatProcessHandler).Methods("POST")
	r.HandleFunc("/config", configHandler).Methods("POST")
	r.HandleFunc("/session", sessionHandler).Methods("POST")
	r.HandleFunc("/verify", verifyHandler).Methods("POST")

	r.PathPrefix("/").Handler(http.FileServer(http.Dir("./public")))

	http.Handle("/", r)
	http.Handle("/api", r)

	port := 3002
	fmt.Printf("Server is running on port %d\n", port)
	http.ListenAndServe(fmt.Sprintf(":%d", port), nil)
}
