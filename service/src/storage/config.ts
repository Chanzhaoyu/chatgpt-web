import { ObjectId } from 'mongodb'
import * as dotenv from 'dotenv'
import { isNotEmptyString } from '../utils/is'
import { Config, MailConfig, SiteConfig } from './model'
import { getConfig } from './mongo'

dotenv.config()

let cachedConfig: Config | undefined
let cacheExpiration = 0

export async function getCacheConfig(): Promise<Config> {
  const now = Date.now()
  if (cachedConfig && cacheExpiration > now)
    return Promise.resolve(cachedConfig)

  const loadedConfig = await getOriginConfig()

  cachedConfig = loadedConfig
  cacheExpiration = now + 10 * 60 * 1000

  return Promise.resolve(cachedConfig)
}

export async function getOriginConfig() {
  let config = await getConfig()
  if (config == null) {
    config = new Config(new ObjectId(),
      !isNaN(+process.env.TIMEOUT_MS) ? +process.env.TIMEOUT_MS : 30 * 1000,
      process.env.OPENAI_API_KEY,
      process.env.OPENAI_API_DISABLE_DEBUG === 'true',
      process.env.OPENAI_ACCESS_TOKEN,
      process.env.OPENAI_API_BASE_URL,
      process.env.OPENAI_API_MODEL || 'gpt-3.5-turbo',
      process.env.API_REVERSE_PROXY,
      (process.env.SOCKS_PROXY_HOST && process.env.SOCKS_PROXY_PORT)
        ? (`${process.env.SOCKS_PROXY_HOST}:${process.env.SOCKS_PROXY_PORT}`)
        : '',
      (process.env.SOCKS_PROXY_USERNAME && process.env.SOCKS_PROXY_PASSWORD)
        ? (`${process.env.SOCKS_PROXY_USERNAME}:${process.env.SOCKS_PROXY_PASSWORD}`)
        : '',
      process.env.HTTPS_PROXY,
      new SiteConfig(
        process.env.SITE_TITLE || 'ChatGpt Web',
        isNotEmptyString(process.env.AUTH_SECRET_KEY),
        process.env.AUTH_SECRET_KEY,
        process.env.REGISTER_ENABLED === 'true',
        process.env.REGISTER_MAILS,
        process.env.SITE_DOMAIN),
      new MailConfig(process.env.SMTP_HOST,
        !isNaN(+process.env.SMTP_PORT) ? +process.env.SMTP_PORT : 465,
        process.env.SMTP_TSL === 'true',
        process.env.SMTP_USERNAME,
        process.env.SMTP_PASSWORD))
  }
  else {
    if (config.siteConfig.loginEnabled === undefined)
      config.siteConfig.loginEnabled = isNotEmptyString(process.env.AUTH_SECRET_KEY)
    if (config.siteConfig.loginSalt === undefined)
      config.siteConfig.loginSalt = process.env.AUTH_SECRET_KEY
    if (config.apiDisableDebug === undefined)
      config.apiDisableDebug = process.env.OPENAI_API_DISABLE_DEBUG === 'true'
    if (config.socksAuth === undefined) {
      config.socksAuth = (process.env.SOCKS_PROXY_USERNAME && process.env.SOCKS_PROXY_PASSWORD)
        ? (`${process.env.SOCKS_PROXY_USERNAME}:${process.env.SOCKS_PROXY_PASSWORD}`)
        : ''
    }
  }
  return config
}

export function clearConfigCache() {
  cacheExpiration = 0
  cachedConfig = null
}
