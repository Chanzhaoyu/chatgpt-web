export class ConfigState {
  timeoutMs?: number
  apiKey?: string
  accessToken?: string
  accessTokenExpiredTime?: string
  apiBaseUrl?: string
  apiModel?: APIMODEL
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
  Disabled = 6,
}

export enum UserRole {
  Admin = 0,
  User = 1,
  Guest = 2,
}

export class KeyConfig {
  _id?: string
  key: string
  keyModel: APIMODEL
  chatModels: CHATMODEL[]
  userRoles: UserRole[]
  status: Status
  remark: string
  constructor(key: string, keyModel: APIMODEL, chatModels: CHATMODEL[], userRoles: UserRole[], remark: string) {
    this.key = key
    this.keyModel = keyModel
    this.chatModels = chatModels
    this.userRoles = userRoles
    this.status = Status.Normal
    this.remark = remark
  }
}

export type APIMODEL = 'ChatGPTAPI' | 'ChatGPTUnofficialProxyAPI' | undefined

export const apiModelOptions = ['ChatGPTAPI', 'ChatGPTUnofficialProxyAPI'].map((model: string) => {
  return {
    label: model,
    key: model,
    value: model,
  }
})

export const chatModelOptions = [
  'gpt-3.5-turbo',
  'gpt-3.5-turbo-0301',
  'gpt-4',
  'gpt-4-0314',
  'gpt-4-32k',
  'gpt-4-32k-0314',
  'text-davinci-002-render-sha-mobile',
  'gpt-4-mobile',
].map((model: string) => {
  let label = model
  if (model === 'text-davinci-002-render-sha-mobile')
    label = 'gpt-3.5-mobile'
  return {
    label,
    key: model,
    value: model,
  }
})

export const userRoleOptions = Object.values(UserRole).filter(d => isNaN(Number(d))).map((role) => {
  return {
    label: role as string,
    key: role as string,
    value: UserRole[role as keyof typeof UserRole],
  }
})
