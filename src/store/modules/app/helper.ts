import { ss } from '@/utils/storage'

const LOCAL_NAME = 'appSetting'

export interface AppState {
  siderCollapsed: boolean
  theme: 'light' | 'dark'
}

export function defaultSetting(): AppState {
  return { siderCollapsed: false, theme: 'light' }
}

export function getLocalSetting(): AppState {
  const localSetting: AppState | undefined = ss.get(LOCAL_NAME)
  return { ...defaultSetting(), ...localSetting }
}

export function setLocalSetting(setting: AppState): void {
  ss.set(LOCAL_NAME, setting)
}
