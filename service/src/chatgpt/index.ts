import * as dotenv from 'dotenv'
import 'isomorphic-fetch'
import type { ChatGPTAPIOptions, ChatMessage, SendMessageOptions } from 'chatgpt'
import { ChatGPTAPI, ChatGPTUnofficialProxyAPI } from 'chatgpt'
import { SocksProxyAgent } from 'socks-proxy-agent'
import httpsProxyAgent from 'https-proxy-agent'
import fetch from 'node-fetch'
import type { AuditConfig, CHATMODEL, KeyConfig, UserInfo } from 'src/storage/model'
import jwt_decode from 'jwt-decode'
import dayjs from 'dayjs'
import type { TextAuditService } from '../utils/textAudit'
import { textAuditServices } from '../utils/textAudit'
import { getCacheApiKeys, getCacheConfig, getOriginConfig } from '../storage/config'
import { sendResponse } from '../utils'
import { hasAnyRole, isNotEmptyString } from '../utils/is'
import type { ChatContext, ChatGPTUnofficialProxyAPIOptions, JWT, ModelConfig } from '../types'
import { getChatByMessageId } from '../storage/mongo'
import type { RequestOptions } from './types'

const { HttpsProxyAgent } = httpsProxyAgent

dotenv.config()

const ErrorCodeMessage: Record<string, string> = {
  401: '[OpenAI] 提供错误的API密钥 | Incorrect API key provided',
  403: '[OpenAI] 服务器拒绝访问，请稍后再试 | Server refused to access, please try again later',
  502: '[OpenAI] 错误的网关 |  Bad Gateway',
  503: '[OpenAI] 服务器繁忙，请稍后再试 | Server is busy, please try again later',
  504: '[OpenAI] 网关超时 | Gateway Time-out',
  500: '[OpenAI] 服务器繁忙，请稍后再试 | Internal Server Error',
}

let auditService: TextAuditService

export async function initApi(key: KeyConfig, chatModel: CHATMODEL) {
  // More Info: https://github.com/transitive-bullshit/chatgpt-api

  const config = await getCacheConfig()
  const model = chatModel as string

  if (key.keyModel === 'ChatGPTAPI') {
    const OPENAI_API_BASE_URL = config.apiBaseUrl

    const options: ChatGPTAPIOptions = {
      apiKey: key.key,
      completionParams: { model },
      debug: !config.apiDisableDebug,
      messageStore: undefined,
      getMessageById,
    }
    // increase max token limit if use gpt-4
    if (model.toLowerCase().includes('gpt-4')) {
      // if use 32k model
      if (model.toLowerCase().includes('32k')) {
        options.maxModelTokens = 32768
        options.maxResponseTokens = 8192
      }
      else {
        options.maxModelTokens = 8192
        options.maxResponseTokens = 2048
      }
    }

    if (isNotEmptyString(OPENAI_API_BASE_URL))
      options.apiBaseUrl = `${OPENAI_API_BASE_URL}/v1`

    await setupProxy(options)

    return new ChatGPTAPI({ ...options })
  }
  else {
    const options: ChatGPTUnofficialProxyAPIOptions = {
      accessToken: key.key,
      apiReverseProxyUrl: isNotEmptyString(config.reverseProxy) ? config.reverseProxy : 'https://ai.fakeopen.com/api/conversation',
      model,
      debug: !config.apiDisableDebug,
    }

    await setupProxy(options)

    return new ChatGPTUnofficialProxyAPI({ ...options })
  }
}

async function chatReplyProcess(options: RequestOptions) {
  const model = options.chatModel
  const key = options.key
  if (key == null || key === undefined)
    throw new Error('没有可用的配置。请再试一次 | No available configuration. Please try again.')

  const { message, lastContext, process, systemMessage, temperature, top_p } = options

  try {
    const timeoutMs = (await getCacheConfig()).timeoutMs
    let options: SendMessageOptions = { timeoutMs }

    if (key.keyModel === 'ChatGPTAPI') {
      if (isNotEmptyString(systemMessage))
        options.systemMessage = systemMessage
      options.completionParams = { model, temperature, top_p }
    }

    if (lastContext != null) {
      if (key.keyModel === 'ChatGPTAPI')
        options.parentMessageId = lastContext.parentMessageId
      else
        options = { ...lastContext }
    }
    const api = await initApi(key, model)
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
  finally {
    releaseApiKey(key)
  }
}

export function initAuditService(audit: AuditConfig) {
  if (!audit || !audit.options || !audit.options.apiKey || !audit.options.apiSecret)
    return
  const Service = textAuditServices[audit.provider]
  auditService = new Service(audit.options)
}

async function containsSensitiveWords(audit: AuditConfig, text: string): Promise<boolean> {
  if (audit.customizeEnabled && isNotEmptyString(audit.sensitiveWords)) {
    const textLower = text.toLowerCase()
    const notSafe = audit.sensitiveWords.split('\n').filter(d => textLower.includes(d.trim().toLowerCase())).length > 0
    if (notSafe)
      return true
  }
  if (audit.enabled) {
    if (!auditService)
      initAuditService(audit)
    return await auditService.containsSensitiveWords(text)
  }
  return false
}

async function fetchAccessTokenExpiredTime() {
  const config = await getCacheConfig()
  const jwt = jwt_decode(config.accessToken) as JWT
  if (jwt.exp)
    return dayjs.unix(jwt.exp).format('YYYY-MM-DD HH:mm:ss')
  return '-'
}

let cachedBalance: number | undefined
let cacheExpiration = 0

async function fetchBalance() {
  const now = new Date().getTime()
  if (cachedBalance && cacheExpiration > now)
    return Promise.resolve(cachedBalance.toFixed(3))

  // 计算起始日期和结束日期
  const startDate = new Date(now - 90 * 24 * 60 * 60 * 1000)
  const endDate = new Date(now + 24 * 60 * 60 * 1000)

  const config = await getCacheConfig()
  const OPENAI_API_KEY = config.apiKey
  const OPENAI_API_BASE_URL = config.apiBaseUrl

  if (!isNotEmptyString(OPENAI_API_KEY))
    return Promise.resolve('-')

  const API_BASE_URL = isNotEmptyString(OPENAI_API_BASE_URL)
    ? OPENAI_API_BASE_URL
    : 'https://api.openai.com'

  // 查是否订阅
  const urlSubscription = `${API_BASE_URL}/v1/dashboard/billing/subscription`
  // 查普通账单
  // const urlBalance = `${API_BASE_URL}/dashboard/billing/credit_grants`
  // 查使用量
  const urlUsage = `${API_BASE_URL}/v1/dashboard/billing/usage?start_date=${formatDate(startDate)}&end_date=${formatDate(endDate)}`

  const headers = {
    'Authorization': `Bearer ${OPENAI_API_KEY}`,
    'Content-Type': 'application/json',
  }
  let socksAgent
  let httpsAgent
  if (isNotEmptyString(config.socksProxy)) {
    socksAgent = new SocksProxyAgent({
      hostname: config.socksProxy.split(':')[0],
      port: parseInt(config.socksProxy.split(':')[1]),
      userId: isNotEmptyString(config.socksAuth) ? config.socksAuth.split(':')[0] : undefined,
      password: isNotEmptyString(config.socksAuth) ? config.socksAuth.split(':')[1] : undefined,
    })
  }
  else if (isNotEmptyString(config.httpsProxy)) {
    httpsAgent = new HttpsProxyAgent(config.httpsProxy)
  }

  try {
    // 获取API限额
    let response = await fetch(urlSubscription, { agent: socksAgent === undefined ? httpsAgent : socksAgent, headers })
    if (!response.ok) {
      console.error('您的账户已被封禁，请登录OpenAI进行查看。')
      return
    }
    const subscriptionData = await response.json()
    const totalAmount = subscriptionData.hard_limit_usd

    // 获取已使用量
    response = await fetch(urlUsage, { agent: socksAgent === undefined ? httpsAgent : socksAgent, headers })
    const usageData = await response.json()
    const totalUsage = usageData.total_usage / 100

    // 计算剩余额度
    cachedBalance = totalAmount - totalUsage
    cacheExpiration = now + 60 * 60 * 1000

    return Promise.resolve(cachedBalance.toFixed(3))
  }
  catch (error) {
    global.console.error(error)
    return Promise.resolve('-')
  }
}

function formatDate(date) {
  const year = date.getFullYear()
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const day = date.getDate().toString().padStart(2, '0')

  return `${year}-${month}-${day}`
}

async function chatConfig() {
  const config = await getOriginConfig() as ModelConfig
  if (config.apiModel === 'ChatGPTAPI')
    config.balance = await fetchBalance()
  else
    config.accessTokenExpiredTime = await fetchAccessTokenExpiredTime()
  return sendResponse<ModelConfig>({
    type: 'Success',
    data: config,
  })
}

async function setupProxy(options: ChatGPTAPIOptions | ChatGPTUnofficialProxyAPIOptions) {
  const config = await getCacheConfig()
  if (isNotEmptyString(config.socksProxy)) {
    const agent = new SocksProxyAgent({
      hostname: config.socksProxy.split(':')[0],
      port: parseInt(config.socksProxy.split(':')[1]),
      userId: isNotEmptyString(config.socksAuth) ? config.socksAuth.split(':')[0] : undefined,
      password: isNotEmptyString(config.socksAuth) ? config.socksAuth.split(':')[1] : undefined,

    })
    options.fetch = (url, options) => {
      return fetch(url, { agent, ...options })
    }
  }
  else {
    if (isNotEmptyString(config.httpsProxy)) {
      const httpsProxy = config.httpsProxy
      if (httpsProxy) {
        const agent = new HttpsProxyAgent(httpsProxy)
        options.fetch = (url, options) => {
          return fetch(url, { agent, ...options })
        }
      }
    }
  }
}

async function getMessageById(id: string): Promise<ChatMessage | undefined> {
  const isPrompt = id.startsWith('prompt_')
  const chatInfo = await getChatByMessageId(isPrompt ? id.substring(7) : id)

  if (chatInfo) {
    if (isPrompt) { // prompt
      return {
        id,
        conversationId: chatInfo.options.conversationId,
        parentMessageId: chatInfo.options.parentMessageId,
        role: 'user',
        text: chatInfo.prompt,
      }
    }
    else {
      return { // completion
        id,
        conversationId: chatInfo.options.conversationId,
        parentMessageId: `prompt_${id}`, // parent message is the prompt
        role: 'assistant',
        text: chatInfo.response,
      }
    }
  }
  else { return undefined }
}

const _lockedKeys: string[] = []
async function randomKeyConfig(keys: KeyConfig[]): Promise < KeyConfig | null > {
  if (keys.length <= 0)
    return null
  let unsedKeys = keys.filter(d => !_lockedKeys.includes(d.key))
  const start = Date.now()
  while (unsedKeys.length <= 0) {
    if (Date.now() - start > 3000)
      break
    await new Promise(resolve => setTimeout(resolve, 1000))
    unsedKeys = keys.filter(d => !_lockedKeys.includes(d.key))
  }
  if (unsedKeys.length <= 0)
    return null
  const thisKey = unsedKeys[Math.floor(Math.random() * unsedKeys.length)]
  _lockedKeys.push(thisKey.key)
  return thisKey
}

async function getRandomApiKey(user: UserInfo): Promise<KeyConfig | undefined> {
  const keys = (await getCacheApiKeys()).filter(d => hasAnyRole(d.userRoles, user.roles))
  return randomKeyConfig(keys)
}

async function releaseApiKey(key: KeyConfig) {
  if (key == null || key === undefined)
    return

  const index = _lockedKeys.indexOf(key.key)
  if (index >= 0)
    _lockedKeys.splice(index, 1)
}

export type { ChatContext, ChatMessage }

export { chatReplyProcess, chatConfig, containsSensitiveWords, getRandomApiKey }
