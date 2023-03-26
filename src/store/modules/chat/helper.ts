import { ss } from '@/utils/storage'

const LOCAL_NAME = 'chatStorage'
export const defaultUsingContextValue = true

export function defaultState(): Chat.ChatState {
  const uuid = 1002
  return {
    active: uuid,
    usingContext: [],
    history: [{ uuid, title: 'New Chat', isEdit: false }],
    chat: [{ uuid, data: [] }],
  }
}

export function getLocalState(): Chat.ChatState {
  const localState = ss.get(LOCAL_NAME)

  // reset old state of usingContext
  if (localState?.usingContext && typeof localState.usingContext === 'boolean') {
    const history = localState.history
    localState.usingContext = []
    history?.forEach((item: Chat.History) => {
      localState.usingContext.push({ uuid: item.uuid, context: defaultUsingContextValue })
    })
    setLocalState(localState)
  }

  return { ...defaultState(), ...localState }
}

export function setLocalState(state: Chat.ChatState) {
  ss.set(LOCAL_NAME, state)
}
