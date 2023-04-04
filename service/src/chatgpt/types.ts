import type { ChatMessage } from 'chatgpt'

export interface RequestOptions {
  message: string
  lastContext?: { conversationId?: string; parentMessageId?: string }
  process?: (chat: ChatMessage) => void
  systemMessage?: string
  completionParams?: {
    model: string
    stop?: string[]
  }
}

export interface BalanceResponse {
  total_usage: number
}
