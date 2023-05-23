import type { ChatMessage } from 'chatgpt'
import type { CHATMODEL, KeyConfig } from 'src/storage/model'

export interface RequestOptions {
  message: string
  lastContext?: { conversationId?: string; parentMessageId?: string }
  process?: (chat: ChatMessage) => void
  systemMessage?: string
  temperature?: number
  top_p?: number
  chatModel: CHATMODEL
  key: KeyConfig
}

export interface BalanceResponse {
  total_usage: number
}
