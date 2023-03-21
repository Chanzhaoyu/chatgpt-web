import * as dotenv from 'dotenv'
import 'isomorphic-fetch'
import type { ChatGPTAPIOptions, ChatMessage, SendMessageOptions } from 'chatgpt'
import { ChatGPTAPI, ChatGPTUnofficialProxyAPI } from 'chatgpt'
import { SocksProxyAgent } from 'socks-proxy-agent'
import { HttpsProxyAgent } from 'https-proxy-agent'
import fetch from 'node-fetch'
import axios from 'axios'
import { getCacheConfig, getOriginConfig } from '../storage/config'
import { sendResponse } from '../utils'
import { isNotEmptyString } from '../utils/is'
import type { ApiModel, ChatContext, ChatGPTUnofficialProxyAPIOptions, ModelConfig } from '../types'

const ErrorCodeMessage: Record<string, string> = {
  401: '[OpenAI] 提供错误的API密钥 | Incorrect API key provided',
  403: '[OpenAI] 服务器拒绝访问，请稍后再试 | Server refused to access, please try again later',
  502: '[OpenAI] 错误的网关 |  Bad Gateway',
  503: '[OpenAI] 服务器繁忙，请稍后再试 | Server is busy, please try again later',
  504: '[OpenAI] 网关超时 | Gateway Time-out',
  500: '[OpenAI] 服务器繁忙，请稍后再试 | Internal Server Error',
}

dotenv.config()

let apiModel: ApiModel

let api: ChatGPTAPI | ChatGPTUnofficialProxyAPI

export async function initApi() {
  // More Info: https://github.com/transitive-bullshit/chatgpt-api

  const config = await getCacheConfig()
  if (!config.apiKey && !config.accessToken)
    throw new Error('Missing OPENAI_API_KEY or OPENAI_ACCESS_TOKEN environment variable')

  if (config.apiKey) {
    const OPENAI_API_MODEL = config.apiModel
    const model = isNotEmptyString(OPENAI_API_MODEL) ? OPENAI_API_MODEL : 'gpt-3.5-turbo'

    const options: ChatGPTAPIOptions = {
      apiKey: config.apiKey,
      completionParams: { model },
      debug: true,
    }

    if (isNotEmptyString(config.apiBaseUrl))
      options.apiBaseUrl = config.apiBaseUrl

    await setupProxy(options)

    api = new ChatGPTAPI({ ...options })
    apiModel = 'ChatGPTAPI'
  }
  else {
    const options: ChatGPTUnofficialProxyAPIOptions = {
      accessToken: config.accessToken,
      debug: true,
    }

    if (isNotEmptyString(config.reverseProxy))
      options.apiReverseProxyUrl = config.reverseProxy

    await setupProxy(options)

    api = new ChatGPTUnofficialProxyAPI({ ...options })
    apiModel = 'ChatGPTUnofficialProxyAPI'
  }
}

async function chatReplyProcess(
  message: string,
  lastContext?: { conversationId?: string; parentMessageId?: string },
  process?: (chat: ChatMessage) => void,
) {
  const timeoutMs = (await getCacheConfig()).timeoutMs
  try {
    let options: SendMessageOptions = { timeoutMs }

    if (lastContext) {
      if (apiModel === 'ChatGPTAPI')
        options = { parentMessageId: lastContext.parentMessageId }
      else
        options = { ...lastContext }
    }

    const response = await api.sendMessage(message, {
      ...options,
      onProgress: (partialResponse) => {
        process?.(partialResponse)
      },
    })

    return sendResponse({ type: 'Success', data: response })
  }
  catch (error: any) {
    const code = error.statusCode
    global.console.log(error)
    if (Reflect.has(ErrorCodeMessage, code))
      return sendResponse({ type: 'Fail', message: ErrorCodeMessage[code] })
    return sendResponse({ type: 'Fail', message: error.message ?? 'Please check the back-end console' })
  }
}

async function fetchBalance() {
  const config = await getCacheConfig()
  const OPENAI_API_KEY = config.apiKey
  const OPENAI_API_BASE_URL = config.apiBaseUrl

  if (!isNotEmptyString(OPENAI_API_KEY))
    return Promise.resolve('-')

  const API_BASE_URL = isNotEmptyString(OPENAI_API_BASE_URL)
    ? OPENAI_API_BASE_URL
    : 'https://api.openai.com'

  try {
    const headers = { 'Content-Type': 'application/json', 'Authorization': `Bearer ${OPENAI_API_KEY}` }
    const response = await axios.get(`${API_BASE_URL}/dashboard/billing/credit_grants`, { headers })
    const balance = response.data.total_available ?? 0
    return Promise.resolve(balance.toFixed(3))
  }
  catch {
    return Promise.resolve('-')
  }
}

async function chatConfig() {
  const config = await getOriginConfig() as ModelConfig
  config.balance = await fetchBalance()
  return sendResponse<ModelConfig>({
    type: 'Success',
    data: config,
  })
}

async function setupProxy(options: ChatGPTAPIOptions | ChatGPTUnofficialProxyAPIOptions) {
  const config = await getCacheConfig()
  if (config.socksProxy) {
    const agent = new SocksProxyAgent({
      hostname: config.socksProxy.split(':')[0],
      port: parseInt(config.socksProxy.split(':')[1]),
    })
    options.fetch = (url, options) => {
      return fetch(url, { agent, ...options })
    }
  }
  else {
    if (config.httpsProxy || process.env.ALL_PROXY) {
      const httpsProxy = config.httpsProxy || process.env.ALL_PROXY
      if (httpsProxy) {
        const agent = new HttpsProxyAgent(httpsProxy)
        options.fetch = (url, options) => {
          return fetch(url, { agent, ...options })
        }
      }
    }
  }
}

function currentModel(): ApiModel {
  return apiModel
}

initApi()

export type { ChatContext, ChatMessage }

export { chatReplyProcess, chatConfig, currentModel }
