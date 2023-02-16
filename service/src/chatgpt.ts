import * as dotenv from 'dotenv'
import 'isomorphic-fetch'
import type { ChatGPTAPI, SendMessageOptions } from 'chatgpt'
import { sendResponse } from './utils'

export interface ChatContext {
  conversationId?: string
  parentMessageId?: string
}

dotenv.config()

const apiKey = process.env.OPENAI_API_KEY

if (apiKey === undefined)
  throw new Error('OPENAI_API_KEY is not defined')

let api: ChatGPTAPI

// To use ESM in CommonJS, you can use a dynamic import
(async () => {
  // More Info: https://github.com/transitive-bullshit/chatgpt-api
  const { ChatGPTAPI } = await import('chatgpt')
  api = new ChatGPTAPI({ apiKey: process.env.OPENAI_API_KEY })
})()

async function chatReply(
  message: string,
  lastContext?: { conversationId?: string; parentMessageId?: string },
) {
  if (!message)
    return sendResponse({ type: 'Fail', message: 'Message is empty' })

  try {
    let options: SendMessageOptions = { timeoutMs: 30 * 1000 }

    if (lastContext)
      options = { ...lastContext }

    const response = await api.sendMessage(message, { ...options })

    return sendResponse({ type: 'Success', data: response })
  }
  catch (error: any) {
    return sendResponse({ type: 'Fail', message: error.message })
  }
}

export { chatReply }
