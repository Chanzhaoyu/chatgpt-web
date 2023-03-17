package main

import (
	"bufio"
	"context"

	"encoding/json"
	"errors"
	"fmt"
	"io"

	"io/ioutil"

	"net/http"
	"net/url"
	"os"
	"strings"

	"github.com/google/uuid"

	"github.com/gorilla/mux"
	openai "github.com/sashabaranov/go-openai"

	"github.com/skrashevich/chatgpt-web/goservice/chatgpt"
	"github.com/skrashevich/chatgpt-web/goservice/html"
	"golang.org/x/crypto/ssh/terminal"
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

type ChatResponse struct {
	Role            string                              `json:"role"`
	Id              string                              `json:"id"`
	ParentMessageId string                              `json:"parentMessageId"`
	Delta           string                              `json:"delta"`
	Text            string                              `json:"text"`
	Detail          openai.ChatCompletionStreamResponse `json:"detail"`
}

type ModelConfig struct {
	APIModel     string `json:"apiModel"`
	ReverseProxy string `json:"reverseProxy"`
	TimeoutMs    int    `json:"timeoutMs"`
	SocksProxy   string `json:"socksProxy"`
	HttpsProxy   string `json:"httpsProxy"`
	Balance      string `json:"balance"`
}

var openAIKey string

func chatProcessHandler(chatStorage *chatgpt.ChatStorage) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
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

		client := openai.NewClientWithConfig(config)
		ctx := context.Background()

		if req.Options.ParentMessageId == "" {
			req.Options.ParentMessageId = uuid.NewString()
		}
		newMessageId := uuid.NewString()
		chatStorage.AddMessage(newMessageId, req.Options.ParentMessageId, openai.ChatCompletionMessage{
			Role:    openai.ChatMessageRoleUser,
			Content: req.Prompt,
		})
		messages, err := chatStorage.GetMessages(newMessageId)
		reqData := openai.ChatCompletionRequest{
			Model:    openai.GPT3Dot5Turbo,
			Messages: messages,
			Stream:   true,
		}
		fmt.Printf("Request data: %v\n", reqData)
		stream, err := client.CreateChatCompletionStream(ctx, reqData)
		if err != nil {
			fmt.Printf("CompletionStream error: %v\n", err)
			return
		}
		defer stream.Close()

		text := ""
		messageId := ""
		for {
			response, err := stream.Recv()

			if errors.Is(err, io.EOF) {
				if messageId != "" {
					chatStorage.AddMessage(messageId, newMessageId, openai.ChatCompletionMessage{
						Role:    openai.ChatMessageRoleAssistant,
						Content: text,
					})
				}
				fmt.Println("Stream finished")
				return
			}

			if err != nil {
				fmt.Printf("Stream error: %v\n", err)
				return
			}

			fmt.Printf("Stream response: %v\n", response)
			messageId = response.ID
			text = text + response.Choices[0].Delta.Content
			resp, _ := json.Marshal(ChatResponse{
				Role:            openai.ChatMessageRoleAssistant,
				Id:              response.ID,
				ParentMessageId: newMessageId,
				Text:            text,
				Delta:           response.Choices[0].Delta.Content,
				Detail:          response,
			})
			if response.Choices[0].FinishReason == "" {
				resp = append(resp, []byte("\n")...)
			}
			w.Write(resp)
		}

	}
}

func fetchBalance() (string, error) {
	openAPIBaseURL := os.Getenv("OPENAI_API_BASE_URL")

	if openAIKey == "" {
		return "-", nil
	}

	apiBaseURL := "https://api.openai.com"
	if openAPIBaseURL != "" {
		apiBaseURL = openAPIBaseURL
	}

	client := &http.Client{}
	req, err := http.NewRequest("GET", fmt.Sprintf("%s/dashboard/billing/credit_grants", apiBaseURL), nil)
	if err != nil {
		return "-", err
	}

	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Authorization", fmt.Sprintf("Bearer %s", openAIKey))

	resp, err := client.Do(req)
	if err != nil {
		return "-", err
	}
	defer resp.Body.Close()

	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		return "-", err
	}

	var data struct {
		TotalAvailable float64 `json:"total_available"`
	}
	if err := json.Unmarshal(body, &data); err != nil {
		return "-", err
	}

	return fmt.Sprintf("%.3f", data.TotalAvailable), nil
}

func chatConfig() (ModelConfig, error) {
	balance, err := fetchBalance()
	if err != nil {
		balance = "error"
	}

	reverseProxy := os.Getenv("API_REVERSE_PROXY")
	if reverseProxy == "" {
		reverseProxy = "-"
	}

	httpsProxy := os.Getenv("HTTPS_PROXY")

	if httpsProxy == "" {
		httpsProxy = "-"
	}

	socksProxy := "-"
	socksHost := os.Getenv("SOCKS_PROXY_HOST")
	socksPort := os.Getenv("SOCKS_PROXY_PORT")
	if socksHost != "" && socksPort != "" {
		socksProxy = fmt.Sprintf("%s:%s", socksHost, socksPort)
	}

	config := ModelConfig{
		APIModel:     openai.GPT3Dot5Turbo,
		ReverseProxy: reverseProxy,
		TimeoutMs:    0,
		SocksProxy:   socksProxy,
		HttpsProxy:   httpsProxy,
		Balance:      balance,
	}

	return config, nil
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
			Model: openai.GPT3Dot5Turbo,
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

	if openAIKey == "" {
		if terminal.IsTerminal(int(os.Stdin.Fd())) {
			reader := bufio.NewReader(os.Stdin)
			fmt.Print("Enter your OpenAI API Key: ")
			var err error
			openAIKey, err = reader.ReadString('\n')
			if err != nil {
				fmt.Fprintf(os.Stderr, "Error reading input: %v\n", err)
				os.Exit(1)
			}
		} else {
			fmt.Println("OPENAI_API_KEY is not provided and terminal non-interactive. Exiting.")
			os.Exit(1)
		}
	}

	chatStorage, err := chatgpt.NewChatStorage()
	if err != nil {
		panic(err)
	}
	defer chatStorage.Close()

	// Get the subdirectory containing the static files
	staticFiles := http.FS(html.Static)

	r := mux.NewRouter()

	r.HandleFunc("/chat-process", chatProcessHandler(chatStorage)).Methods("POST")
	r.HandleFunc("/config", configHandler).Methods("POST")
	r.HandleFunc("/session", sessionHandler).Methods("POST")
	r.HandleFunc("/verify", verifyHandler).Methods("POST")

	r.PathPrefix("/").Handler(http.FileServer(staticFiles))

	http.Handle("/", r)
	http.Handle("/api", r)

	port := 3002
	fmt.Printf("Server is running on port %d\n", port)
	http.ListenAndServe(fmt.Sprintf(":%d", port), nil)
}
