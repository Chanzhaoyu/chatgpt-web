import type { GenericAbortSignal } from 'axios'
import { post } from '@/utils/request'

export const controller = new AbortController()

export function fetchChatAPI<T = any>(
  prompt: string,
  options?: { conversationId?: string; parentMessageId?: string },
  signal?: GenericAbortSignal,
) {
  return post<T>({
    url: '/chat',
    data: { prompt, options },
    signal,
  })
}
