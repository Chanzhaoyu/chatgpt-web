import type { ChatMessage } from 'chatgpt'
import type { CHATMODEL } from 'src/storage/model'

export interface RequestOptions {
  message: string
  lastContext?: { conversationId?: string; parentMessageId?: string }
  process?: (chat: ChatMessage) => void
  systemMessage?: string
  temperature?: number
  top_p?: number
  chatModel: CHATMODEL
}

export interface BalanceResponse {
  total_usage: number
}
