import { ls } from '@/utils/storage'

export interface AppState {
  siderCollapsed: boolean
}

export function defaultSetting() {
  return { siderCollapsed: false }
}

export function getAppSetting() {
  const localSetting: AppState = ls.get('appSetting')
  return localSetting ?? defaultSetting()
}

export function setAppSetting(setting: AppState) {
  ls.set('appSetting', setting)
}
