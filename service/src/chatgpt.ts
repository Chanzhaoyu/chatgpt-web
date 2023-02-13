import * as dotenv from 'dotenv'
import { ChatGPTAPI } from 'chatgpt'

interface ChatContext {
  conversationId?: string
  parentMessageId?: string
}

dotenv.config()

const apiKey = process.env.OPENAI_API_KEY

if (apiKey === undefined)
  throw new Error('OPENAI_API_KEY is not defined')

const chatContext = new Set<ChatContext>()

/**
 * More Info: https://github.com/transitive-bullshit/chatgpt-api
 */
const api = new ChatGPTAPI({ apiKey })

async function chatReply(message: string) {
  if (!message)
    return

  // Get the last context from the chat context
  // If there is a last context, add it to the options
  let options = {}
  const lastContext = Array.from(chatContext).pop()
  if (lastContext) {
    const { conversationId, parentMessageId } = lastContext
    options = { conversationId, parentMessageId }
  }

  // Send the message to the API
  const response = await api.sendMessage(message, { ...options })

  const { conversationId, id } = response

  // Add the new context to the chat context
  if (conversationId && id)
    chatContext.add({ conversationId, parentMessageId: id })

  return response
}

async function clearChatContext() {
  // Clear the chat context
  chatContext.clear()
  return Promise.resolve({ message: 'Chat context cleared' })
}

export { chatReply, clearChatContext }
