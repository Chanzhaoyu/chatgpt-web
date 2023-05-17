import type { FetchFn } from 'chatgpt'

export interface RequestProps {
  prompt: string
  options?: ChatContext
  systemMessage: string
  temperature?: number
  top_p?: number
}

export interface ChatContext {
  conversationId?: string
  parentMessageId?: string
}

export interface ChatGPTUnofficialProxyAPIOptions {
  accessToken: string
  apiReverseProxyUrl?: string
  model?: string
  debug?: boolean
  headers?: Record<string, string>
  fetch?: FetchFn
}

export interface ModelConfig {
  apiModel?: ApiModel
  reverseProxy?: string
  timeoutMs?: number
  socksProxy?: string
  httpsProxy?: string
  usage?: string
  accessTokenExpirationTime?: string
}

export interface JWT {
  'https://api.openai.com/profile': {
    'email': string
    'email_verified': boolean
  }
  'https://api.openai.com/auth': {
    'user_id': string
  }
  'iss': string
  'sub': string
  'aud': []
  'iat': number
  'exp': number
  'azp': string
  'scope': string
}

export type ApiModel = 'ChatGPTAPI' | 'ChatGPTUnofficialProxyAPI' | undefined
