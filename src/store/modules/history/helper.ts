import { ss } from '@/utils/storage'

const LOCAL_NAME = 'historyChat'

export interface HistoryState {
  historyChat: Chat.HistoryChat[]
  active: number | null
  heartbeat: boolean
}

export function defaultSetting() {
  return { historyChat: [], active: null, heartbeat: false }
}

export function getLocalHistory() {
  const localSetting: HistoryState | undefined = ss.get(LOCAL_NAME)
  return localSetting ?? defaultSetting()
}

export function setLocalHistory(data: HistoryState) {
  ss.set(LOCAL_NAME, data)
}
