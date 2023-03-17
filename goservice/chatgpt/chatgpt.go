package chatgpt

import (
	"database/sql"
	"encoding/json"
	"log"
)

type Chat struct {
	Id       int         `json:"id"`
	Messages []ChatEntry `json:"messages"`
}
type ChatEntry struct {
	Role    string `json:"role"`
	Content string `json:"content"`
}

var db *sql.DB

func main() {
	db, err := sql.Open("sqlite3", "mydb.db")

	if err != nil {
		log.Fatal(err)
	}
	defer db.Close()

	// Create table
	_, err = db.Exec(`
        CREATE TABLE IF NOT EXISTS chat (
            id INTEGER PRIMARY KEY,
            messages TEXT
        );
    `)
	if err != nil {
		log.Fatal(err)
	}
}

func AddMessage(chatID int, role string, content string) error {
	var messagesStr string
	err := db.QueryRow("SELECT messages FROM chat WHERE id = ?", chatID).Scan(&messagesStr)
	if err != nil {
		return err
	}

	var chat Chat
	err = json.Unmarshal([]byte(messagesStr), &chat.Messages)
	if err != nil {
		return err
	}

	chat.Messages = append(chat.Messages, ChatEntry{Role: role, Content: content})
	updatedMessages, err := json.Marshal(chat.Messages)
	if err != nil {
		return err
	}

	_, err = db.Exec("UPDATE chat SET messages = ? WHERE id = ?", string(updatedMessages), chatID)
	if err != nil {
		return err
	}

	return nil
}

func UpdateMessage(chatID int, index int, role string, content string) error {
	var messagesStr string
	err := db.QueryRow("SELECT messages FROM chat WHERE id = ?", chatID).Scan(&messagesStr)
	if err != nil {
		return err
	}

	var chat Chat
	err = json.Unmarshal([]byte(messagesStr), &chat.Messages)
	if err != nil {
		return err
	}

	chat.Messages[index].Role = role
	chat.Messages[index].Content = content

	updatedMessages, err := json.Marshal(chat.Messages)
	if err != nil {
		return err
	}

	_, err = db.Exec("UPDATE chat SET messages = ? WHERE id = ?", string(updatedMessages), chatID)
	if err != nil {
		return err
	}

	return nil
}

/*
import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"io/ioutil"
	"net/http"
	"net/url"
	"os"
	"strconv"
	"time"

	openai "github.com/sashabaranov/go-openai"
)

var errorCodeMessage = map[int]string{
	401: "[OpenAI] 提供错误的API密钥 | Incorrect API key provided",
	403: "[OpenAI] 服务器拒绝访问，请稍后再试 | Server refused to access, please try again later",
	502: "[OpenAI] 错误的网关 |  Bad Gateway",
	503: "[OpenAI] 服务器繁忙，请稍后再试 | Server is busy, please try again later",
	504: "[OpenAI] 网关超时 | Gateway Time-out",
	500: "[OpenAI] 服务器繁忙，请稍后再试 | Internal Server Error",
}

var timeoutMs int
var apiModel string
var balance string

func main() {
	timeoutMsEnv := os.Getenv("TIMEOUT_MS")
	if timeoutMsEnv != "" {
		parsed, err := strconv.Atoi(timeoutMsEnv)
		if err == nil {
			timeoutMs = parsed
		}
	} else {
		timeoutMs = 30 * 1000
	}

	openAIKey := os.Getenv("OPENAI_API_KEY")

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

	apiModel = "ChatGPTAPI"

}

func ChatReplyProcess(message string, lastContext *chatgpt.Context, process func(chatgpt.ChatMessage)) (*chatgpt.Response, error) {
	ctx, cancel := context.WithTimeout(context.Background(), time.Duration(timeoutMs)*time.Millisecond)
	defer cancel()

	options := chatgpt.SendMessageOptions{
		TimeoutMs: timeoutMs,
		Context:   lastContext,
		OnProgress: func(partialResponse *chatgpt.Response) {
			if process != nil {
				process(partialResponse.ChatMessage)
			}
		},
	}

	response, err := api.SendMessage(ctx, message, options)
	if err != nil {
		code := api.GetStatusCode(err)
		if msg, ok := errorCodeMessage[code]; ok {
			return nil, errors.New(msg)
		}
		return nil, err
	}

	return response, nil
}

func fetchBalance() (string, error) {
	openAIKey := os.Getenv("OPENAI_API_KEY")
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

func chatConfig() (*chatgpt.ModelConfig, error) {
	balance, err := fetchBalance()
	if err != nil {
		return nil, err
	}

	reverseProxy := os.Getenv("API_REVERSE_PROXY")
	if reverseProxy == "" {
		reverseProxy = "-"
	}

	httpsProxy := os.Getenv("HTTPS_PROXY")
	if httpsProxy == "" {
		httpsProxy = os.Getenv("ALL_PROXY")
	}
	if httpsProxy == "" {
		httpsProxy = "-"
	}

	socksProxy := "-"
	socksHost := os.Getenv("SOCKS_PROXY_HOST")
	socksPort := os.Getenv("SOCKS_PROXY_PORT")
	if socksHost != "" && socksPort != "" {
		socksProxy = fmt.Sprintf("%s:%s", socksHost, socksPort)
	}

	config := &chatgpt.ModelConfig{
		APIModel:     apiModel,
		ReverseProxy: reverseProxy,
		TimeoutMs:    timeoutMs,
		SocksProxy:   socksProxy,
		HttpsProxy:   httpsProxy,
		Balance:      balance,
	}

	return config, nil
}

func currentModel() string {
	return apiModel
}
*/
