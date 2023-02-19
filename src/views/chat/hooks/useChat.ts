import { useHistoryStore } from '@/store'

export function useChat() {
  const historyStore = useHistoryStore()

  function addChat(
    message: string,
    args?: { reversal?: boolean; error?: boolean; options?: Chat.ChatOptions },
  ) {
    historyStore.addChat(
      {
        dateTime: new Date().toLocaleString(),
        message,
        reversal: args?.reversal ?? false,
        error: args?.error ?? false,
        options: args?.options ?? undefined,
      },
    )
  }

  function clearChat() {
    historyStore.clearChat()
  }

  return { addChat, clearChat }
}
