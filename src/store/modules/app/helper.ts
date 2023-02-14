import { ss } from '@/utils/storage'

const LOCAL_NAME = 'appSetting'

export interface AppState {
  siderCollapsed: boolean
}

export function defaultSetting() {
  return { siderCollapsed: false }
}

export function getLocalSetting() {
  const localSetting: AppState | undefined = ss.get(LOCAL_NAME)
  return localSetting ?? defaultSetting()
}

export function setLocalSetting(setting: AppState) {
  ss.set(LOCAL_NAME, setting)
}
