import { post } from '@/utils/request'

export function fetchChatAPI<T = any>(prompt: string) {
  return post<T>({
    url: '/chat',
    data: { prompt },
  })
}

export function clearConversations<T = any>() {
  return post<T>({
    url: '/clear',
  })
}
