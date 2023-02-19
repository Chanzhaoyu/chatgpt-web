import zhCN from './zh-cn'
import en from './en'

const locales = {
  'zh-CN': zhCN,
  en,
}

export type LocaleKey = keyof typeof locales

export default locales
