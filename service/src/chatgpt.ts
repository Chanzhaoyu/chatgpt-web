import * as dotenv from 'dotenv'
import 'isomorphic-fetch'
import type { ChatGPTAPI, SendMessageOptions } from 'chatgpt'
import { ChatGPTUnofficialProxyAPI } from 'chatgpt'
import { sendResponse } from './utils'

dotenv.config()

let apiModel: 'ChatGPTAPI' | 'ChatGPTUnofficialProxyAPI' | undefined

export interface ChatContext {
  conversationId?: string
  parentMessageId?: string
}

const timeoutMs: number = !isNaN(+process.env.TIMEOUT_MS) ? +process.env.TIMEOUT_MS : 30 * 1000

if (!process.env.OPENAI_API_KEY && !process.env.OPENAI_ACCESS_TOKEN)
  throw new Error('Missing OPENAI_API_KEY or OPENAI_ACCESS_TOKEN environment variable')

let api: ChatGPTAPI | ChatGPTUnofficialProxyAPI

// To use ESM in CommonJS, you can use a dynamic import
(async () => {
  // More Info: https://github.com/transitive-bullshit/chatgpt-api
  const { ChatGPTAPI } = await import('chatgpt')

  if (process.env.OPENAI_API_KEY) {
    api = new ChatGPTAPI({ apiKey: process.env.OPENAI_API_KEY })
    apiModel = 'ChatGPTAPI'
  }
  else {
    let options = {}

    if (process.env.API_REVERSE_PROXY)
      options = { apiReverseProxyUrl: process.env.API_REVERSE_PROXY }

    api = new ChatGPTUnofficialProxyAPI({
      accessToken: process.env.OPENAI_ACCESS_TOKEN,
      ...options,
    })
    apiModel = 'ChatGPTUnofficialProxyAPI'
  }
})()

async function chatReply(
  message: string,
  lastContext?: { conversationId?: string; parentMessageId?: string },
) {
  if (!message)
    return sendResponse({ type: 'Fail', message: 'Message is empty' })

  try {
    let options: SendMessageOptions = { timeoutMs }

    if (lastContext)
      options = { ...lastContext }

    const response = await api.sendMessage(message, { ...options })

    return sendResponse({ type: 'Success', data: response })
  }
  catch (error: any) {
    return sendResponse({ type: 'Fail', message: error.message })
  }
}

async function chatConfig() {
  return sendResponse({
    type: 'Success',
    data: {
      apiModel,
      reverseProxy: process.env.API_REVERSE_PROXY,
      timeoutMs,
    },
  })
}

export { chatReply, chatConfig }
