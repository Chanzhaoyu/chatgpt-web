import { ss } from '@/utils/storage'

const LOCAL_NAME = 'appSetting'

export type Theme = 'light' | 'dark' | 'auto'

export type Language = 'en-US' | 'es-ES' | 'ko-KR' | 'ru-RU' | 'vi-VN' | 'zh-CN' | 'zh-TW'

const languageMap: { [key: string]: Language } = {
  'en': 'en-US',
  'en-US': 'en-US',
  'es': 'es-ES',
  'es-ES': 'es-ES',
  'ko': 'ko-KR',
  'ko-KR': 'ko-KR',
  'ru': 'ru-RU',
  'ru-RU': 'ru-RU',
  'vi': 'vi-VN',
  'vi-VN': 'vi-VN',
  'zh': 'zh-CN',
  'zh-CN': 'zh-CN',
  'zh-TW': 'zh-TW',
}

export interface AppState {
  siderCollapsed: boolean
  theme: Theme
  language: Language
}

export function defaultSetting(): AppState {
  const language = languageMap[navigator.language]
  return { siderCollapsed: false, theme: 'light', language }
}

export function getLocalSetting(): AppState {
  const localSetting: AppState | undefined = ss.get(LOCAL_NAME)
  return { ...defaultSetting(), ...localSetting }
}

export function setLocalSetting(setting: AppState): void {
  ss.set(LOCAL_NAME, setting)
}
