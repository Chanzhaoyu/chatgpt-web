import * as dotenv from 'dotenv'
import 'isomorphic-fetch'
import type { ChatGPTAPIOptions, ChatMessage, SendMessageOptions } from 'chatgpt'
import { ChatGPTAPI, ChatGPTUnofficialProxyAPI } from 'chatgpt'
import { SocksProxyAgent } from 'socks-proxy-agent'
import fetch from 'node-fetch'
import { sendResponse } from '../utils'
import type { ApiModel, ChatContext, ChatGPTUnofficialProxyAPIOptions, ModelConfig } from '../types'

dotenv.config()

const timeoutMs: number = !isNaN(+process.env.TIMEOUT_MS) ? +process.env.TIMEOUT_MS : 30 * 1000

let apiModel: ApiModel

if (!process.env.OPENAI_API_KEY && !process.env.OPENAI_ACCESS_TOKEN)
  throw new Error('Missing OPENAI_API_KEY or OPENAI_ACCESS_TOKEN environment variable')

let api: ChatGPTAPI | ChatGPTUnofficialProxyAPI

(async () => {
  // More Info: https://github.com/transitive-bullshit/chatgpt-api

  if (process.env.OPENAI_API_KEY) {
    const options: ChatGPTAPIOptions = {
      apiKey: process.env.OPENAI_API_KEY,
      debug: false,
    }

    if (process.env.OPENAI_API_BASE_URL && process.env.OPENAI_API_BASE_URL.trim().length > 0)
      options.apiBaseUrl = process.env.OPENAI_API_BASE_URL

    if (process.env.SOCKS_PROXY_HOST && process.env.SOCKS_PROXY_PORT) {
      const agent = new SocksProxyAgent({
        hostname: process.env.SOCKS_PROXY_HOST,
        port: process.env.SOCKS_PROXY_PORT,
      })
      options.fetch = (url, options) => {
        return fetch(url, { agent, ...options })
      }
    }

    api = new ChatGPTAPI({ ...options })
    apiModel = 'ChatGPTAPI'
  }
  else {
    const options: ChatGPTUnofficialProxyAPIOptions = {
      accessToken: process.env.OPENAI_ACCESS_TOKEN,
      debug: false,
    }

    if (process.env.SOCKS_PROXY_HOST && process.env.SOCKS_PROXY_PORT) {
      const agent = new SocksProxyAgent({
        hostname: process.env.SOCKS_PROXY_HOST,
        port: process.env.SOCKS_PROXY_PORT,
      })
      options.fetch = (url, options) => {
        return fetch(url, { agent, ...options })
      }
    }

    if (process.env.API_REVERSE_PROXY)
      options.apiReverseProxyUrl = process.env.API_REVERSE_PROXY

    api = new ChatGPTUnofficialProxyAPI({ ...options })
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

async function chatReplyProcess(
  message: string,
  lastContext?: { conversationId?: string; parentMessageId?: string },
  process?: (chat: ChatMessage) => void,
) {
  if (!message)
    return sendResponse({ type: 'Fail', message: 'Message is empty' })

  try {
    let options: SendMessageOptions = { timeoutMs }

    if (lastContext)
      options = { ...lastContext }

    const response = await api.sendMessage(message, {
      ...options,
      onProgress: (partialResponse) => {
        process?.(partialResponse)
      },
    })

    return sendResponse({ type: 'Success', data: response })
  }
  catch (error: any) {
    return sendResponse({ type: 'Fail', message: error.message })
  }
}

async function chatConfig() {
  const reverseProxy = process.env.API_REVERSE_PROXY ?? '-'
  let socksProxy = '-'
  const authorized = (typeof process.env.AUTH_SECRET_KEY === 'string' && process.env.AUTH_SECRET_KEY.length) > 0
    ? '1'
    : '0'

  if (process.env.SOCKS_PROXY_HOST && process.env.SOCKS_PROXY_PORT)
    socksProxy = `${process.env.SOCKS_PROXY_HOST}:${process.env.SOCKS_PROXY_PORT}`

  return sendResponse({
    type: 'Success',
    data: { apiModel, authorized, reverseProxy, timeoutMs, socksProxy } as ModelConfig,
  })
}

export type { ChatContext, ChatMessage }

export { chatReply, chatReplyProcess, chatConfig }
