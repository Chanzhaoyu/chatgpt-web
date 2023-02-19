import type { ChatState } from '@/views/chat/types'
import { ss } from '@/utils/storage'

const LOCAL_NAME = 'chatStorage'

export function defaultState(): ChatState {
  const uuid = Date.now()
  return { active: uuid, history: [{ uuid, title: 'New Chat', isEdit: false }], chat: [{ uuid, data: [] }] }
}

export function getLocalState(): ChatState {
  const localState = ss.get(LOCAL_NAME)
  return localState ?? defaultState()
}

export function setLocalState(state: ChatState) {
  ss.set(LOCAL_NAME, state)
}
