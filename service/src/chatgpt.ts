import * as dotenv from 'dotenv'
import type { SendMessageOptions } from 'chatgpt'
import { ChatGPTAPI } from 'chatgpt'
import { sendResponse } from './utils'

export interface ChatContext {
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
    return sendResponse({ type: 'Fail', message: 'Message is empty' })

  try {
    // Get the last context from the chat context
    let options: SendMessageOptions = {}

    const lastContext = Array.from(chatContext).pop()

    if (lastContext)
      options = { ...lastContext }

    const response = await api.sendMessage(message, { ...options })

    const { conversationId, id } = response

    // Add the new context to the chat context
    if (conversationId && id)
      chatContext.add({ conversationId, parentMessageId: id })

    return sendResponse({ type: 'Success', data: response })
  }
  catch (error: any) {
    global.console.log(error)
    return sendResponse({ type: 'Fail', message: error.message })
  }
}

async function chatReplayOne(message: string, options?: ChatContext) {
  if (!message)
    return sendResponse({ type: 'Fail', message: 'Message is empty' })

  try {
    let messageOptions: SendMessageOptions = {}

    if (options) {
      const { conversationId, parentMessageId } = options
      messageOptions = { conversationId, parentMessageId }

      const response = await api.sendMessage(message, { ...messageOptions })

      return sendResponse({ type: 'Success', data: response })
    }
  }
  catch (error: any) {
    return sendResponse({ type: 'Fail', message: error.message })
  }
}

async function clearChatContext() {
  // Clear the chat context
  chatContext.clear()
  return sendResponse({ type: 'Success', message: 'Chat context cleared' })
}

export { chatReply, chatReplayOne, clearChatContext }
