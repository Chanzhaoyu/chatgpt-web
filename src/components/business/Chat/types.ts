export interface ChatOptions {
  conversationId?: string
  parentMessageId?: string
}

export interface ChatProps {
  dateTime: string
  message: string
  reversal?: boolean
  error?: boolean
  options?: ChatOptions
}

export interface HistoryChatProps {
  title: string
  edit: boolean
  data: ChatProps[]
}
