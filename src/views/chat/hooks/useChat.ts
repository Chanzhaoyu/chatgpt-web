import { useChatStore } from '@/store'

export function useChat() {
  const chatStore = useChatStore()

  const addChat = (uuid: number, chat: Chat.Chat) => {
    chatStore.addChatByUuid(uuid, chat)
  }

  const updateChat = (uuid: number, index: number, chat: Chat.Chat) => {
    chatStore.updateChatByUuid(uuid, index, chat)
  }

  return {
    addChat,
    updateChat,
  }
}
