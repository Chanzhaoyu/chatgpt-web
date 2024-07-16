import { get, post } from '@/utils/request'
import type { Agent } from '@/typings/agentChat/Agent'
import type { Message } from '@/api/typing'

export function agentHello<T>(params: any) {
  return get<T>({
    url: '/agent/hello',
    data: params,
  },
  )
}

export function agentExampleQuestions<T>(params: any) {
  return get<T>({
    url: '/agent/example-questions',
    data: params,
  },
  )
}

export function newChat<T>(params: any) {
  return post<T>({
    url: '/chat/add',
    data: params,
  })
}

export interface ChatHistoryPreview {
  agent: Agent
  chatId: string
  title: null | string
  [property: string]: any
}

export function getAllPreviewChat() {
  return get<ChatHistoryPreview[]>({
    url: '/chat/preview-list',
  })
}

export function getMessages(chatId: string) {
  return get<Message[]>({
    url: `/chat/messages?chatId=${chatId}`,
  })
}
