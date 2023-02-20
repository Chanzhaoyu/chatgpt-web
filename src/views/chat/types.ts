export interface Chat {
  dateTime: string
  text: string
  inversion?: boolean
  error?: boolean
  conversationOptions?: ConversationRequest | null
  requestOptions: { prompt: string; options?: ConversationRequest | null }
}

export interface History {
  title: string
  isEdit: boolean
  uuid: number
}

export interface ChatState {
  active: number | null
  history: History[]
  chat: { uuid: number; data: Chat[] }[]
}

export interface ConversationRequest {
  conversationId?: string
  parentMessageId?: string
}

export interface ConversationResponse {
  conversationId: string
  detail: {
    choices: { finish_reason: string; index: number; logprobs: any; text: string }[]
    created: number
    id: string
    model: string
    object: string
    usage: { completion_tokens: number; prompt_tokens: number; total_tokens: number }
  }
  id: string
  parentMessageId: string
  role: string
  text: string
}
