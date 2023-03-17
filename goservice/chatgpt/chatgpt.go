package chatgpt

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"log"
	"os"
	"path/filepath"

	openai "github.com/sashabaranov/go-openai"
	_ "modernc.org/sqlite"
)

type Chat struct {
	Id        int                            `json:"id"`
	MessageId string                         `json:"message_id"`
	Messages  []openai.ChatCompletionMessage `json:"messages"`
}

type ChatStorage struct {
	db *sql.DB
}

func NewChatStorage() (*ChatStorage, error) {

	dbpath := os.Getenv("DATABASE_PATH")
	if dbpath == "" {
		cwd, _ := os.Getwd()
		dbpath = filepath.Join(cwd, "database.sqlite")
	}

	db, err := sql.Open("sqlite", dbpath)

	if err != nil {
		log.Fatal(err)
	}

	// Create table
	_, err = db.Exec(`
        CREATE TABLE IF NOT EXISTS chat (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
			message_id varchar(255),
            messages TEXT
        );
    `)
	if err != nil {
		log.Fatal(err)
	}
	return &ChatStorage{db: db}, nil
}
func (c *ChatStorage) GetMessages(parentMessageId string) ([]openai.ChatCompletionMessage, error) {
	var messagesStr string

	err := c.db.QueryRow("SELECT messages FROM chat WHERE message_id = ?", parentMessageId).Scan(&messagesStr)
	if err != nil {
		return nil, err
	}

	var chat Chat
	err = json.Unmarshal([]byte(messagesStr), &chat.Messages)
	if err != nil {
		return nil, err
	}

	return chat.Messages, nil
}

func (c *ChatStorage) AddMessage(messageId string, parentMessageId string, message openai.ChatCompletionMessage) error {
	var messagesStr string

	if parentMessageId != "" {
		err := c.db.QueryRow("SELECT messages FROM chat WHERE message_id = ?", parentMessageId).Scan(&messagesStr)
		if err != nil {
			//result, err := c.db.Exec("INSERT INTO chat (message_id,messages) VALUES (?,?)", chatID, "")
			if err.Error() != "sql: no rows in result set" {
				fmt.Printf("SELECT messages FROM chat error: %v\n", err)
				return err
			}
		}
		fmt.Printf("messagesStr: %s\n", messagesStr)
	}

	var chat Chat
	if messagesStr != "" {
		err := json.Unmarshal([]byte(messagesStr), &chat.Messages)
		if err != nil {
			fmt.Printf("Unmarshal error: %v\n", err)
			return err
		}
	}

	chat.Messages = append(chat.Messages, message)
	updatedMessages, err := json.Marshal(chat.Messages)
	if err != nil {
		fmt.Printf("Marshal error: %v\n", err)
		return err
	}

	_, err = c.db.Exec("INSERT INTO chat (message_id,messages) VALUES (?,?)", messageId, string(updatedMessages))
	if err != nil {
		fmt.Printf("UPDATE chat error: %v\n", err)
		return err
	}

	return nil
}

/*
	func (c *ChatStorage) UpdateMessage(chatID int, index int, message openai.ChatCompletionStreamResponse) error {
		var messagesStr string

		err := c.db.QueryRow("SELECT messages FROM chat WHERE id = ?", chatID).Scan(&messagesStr)
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

		_, err = c.db.Exec("UPDATE chat SET messages = ? WHERE id = ?", string(updatedMessages), chatID)
		if err != nil {
			return err
		}

		return nil
	}
*/
func (c *ChatStorage) Close() {
	c.db.Close()
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
