export class ConfigState {
  timeoutMs?: number
  apiKey?: string
  accessToken?: string
  accessTokenExpiredTime?: string
  apiBaseUrl?: string
  apiModel?: ApiModel
  reverseProxy?: string
  socksProxy?: string
  socksAuth?: string
  httpsProxy?: string
  balance?: number
  siteConfig?: SiteConfig
  mailConfig?: MailConfig
  auditConfig?: AuditConfig
}

// https://platform.openai.com/docs/models/overview
export type CHATMODEL = 'gpt-3.5-turbo' | 'gpt-3.5-turbo-0301' | 'gpt-4' | 'gpt-4-0314' | 'gpt-4-32k' | 'gpt-4-32k-0314' | 'ext-davinci-002-render-sha-mobile' | 'gpt-4-mobile' | 'gpt-4-browsing'

export class UserConfig {
  chatModel?: CHATMODEL
}

export type ApiModel = 'ChatGPTAPI' | 'ChatGPTUnofficialProxyAPI' | undefined

export class SiteConfig {
  siteTitle?: string
  loginEnabled?: boolean
  loginSalt?: string
  registerEnabled?: boolean
  registerReview?: boolean
  registerMails?: string
  siteDomain?: string
}

export class MailConfig {
  smtpHost?: string
  smtpPort?: number
  smtpTsl?: boolean
  smtpUserName?: string
  smtpPassword?: string
}
export type TextAuditServiceProvider = 'baidu' //  | 'ali'

export interface TextAuditServiceOptions {
  apiKey: string
  apiSecret: string
  label?: string
}
export enum TextAudioType {
  None = 0,
  Request = 1 << 0, // 二进制 01
  Response = 1 << 1, // 二进制 10
  All = Request | Response, // 二进制 11
}

export class AuditConfig {
  enabled?: boolean
  provider?: TextAuditServiceProvider
  options?: TextAuditServiceOptions
  textType?: TextAudioType
  customizeEnabled?: boolean
  sensitiveWords?: string
}

export enum Status {
  Normal = 0,
  Deleted = 1,
  InversionDeleted = 2,
  ResponseDeleted = 3,
  PreVerify = 4,
  AdminVerify = 5,
}
