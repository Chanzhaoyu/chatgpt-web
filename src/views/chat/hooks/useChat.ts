import type { Chat } from '@/views/chat/types'
import { useChatStore } from '@/store'

export function useChat() {
  const chatStore = useChatStore()

  const addChat = (uuid: number, chat: Chat) => {
    chatStore.addChatByUuid(uuid, chat)
  }

  const updateChat = (uuid: number, index: number, chat: Chat) => {
    chatStore.updateChatByUuid(uuid, index, chat)
  }

  return {
    addChat,
    updateChat,
  }
}
