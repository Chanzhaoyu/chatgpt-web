import { post } from '@/utils/request'

export function fetchChatAPI<T = any>(
  prompt: string,
  options?: { conversationId?: string; parentMessageId?: string },
) {
  return post<T>({
    url: '/chat',
    data: { prompt, options },
  })
}

export function clearConversations<T = any>() {
  return post<T>({
    url: '/clear',
  })
}
