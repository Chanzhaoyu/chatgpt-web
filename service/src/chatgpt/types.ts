import type { ChatMessage } from 'chatgpt'
import type { ChatRoom, UserInfo } from 'src/storage/model'

export interface RequestOptions {
  message: string
  lastContext?: { conversationId?: string; parentMessageId?: string }
  process?: (chat: ChatMessage) => void
  systemMessage?: string
  temperature?: number
  top_p?: number
  user: UserInfo
  messageId: string
  tryCount: number
  room: ChatRoom
}

export interface BalanceResponse {
  total_usage: number
}
