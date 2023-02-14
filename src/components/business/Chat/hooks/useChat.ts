import { useHistoryStore } from '@/store'

export function useChat() {
  const historyStore = useHistoryStore()

  function addChat(message: string, args?: { reversal?: boolean; error?: boolean; options?: Chat.ChatOptions }) {
    if (historyStore.historyChat.length === 0) {
      historyStore.addHistory({
        title: message,
        isEdit: false,
        data: [],
      })
      historyStore.chooseHistory(historyStore.historyChat.length - 1)
    }

    historyStore.addChat({
      dateTime: new Date().toLocaleString(),
      message,
      reversal: args?.reversal ?? false,
      error: args?.error ?? false,
      options: args?.options ?? undefined,
    })
  }

  function clearChat() {
    historyStore.clearChat()
  }

  return { addChat, clearChat }
}
