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

func (c *ChatStorage) Close() {
	c.db.Close()
}
