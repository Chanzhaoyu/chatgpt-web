import type { AxiosProgressEvent, GenericAbortSignal } from 'axios'
import { get, post } from '@/utils/request'
import { useAuthStore, useSettingStore } from '@/store'
const baseUrl = 'http://106.55.7.164:8069'
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

export function fetchChatConfig<T = any>() {
  return post<T>({
    url: '/config',
  })
}

export function fetchChatAPIProcess<T = any>(
  params: {
    prompt: string
    options?: { conversationId?: string; parentMessageId?: string }
    signal?: GenericAbortSignal
    onDownloadProgress?: (progressEvent: AxiosProgressEvent) => void
  },
) {
  const settingStore = useSettingStore()
  const authStore = useAuthStore()

  let data: Record<string, any> = {
    prompt: params.prompt,
    options: params.options,
  }

  if (authStore.isChatGPTAPI) {
    data = {
      ...data,
      systemMessage: settingStore.systemMessage,
      temperature: settingStore.temperature,
      top_p: settingStore.top_p,
    }
  }

  return post<T>({
    url: '/chat-process',
    data,
    signal: params.signal,
    onDownloadProgress: params.onDownloadProgress,
  })
}
export function fetchNewChatAPIProcess<T = any>(
  params: {
    question: string
    chatId: any
    options?: { conversationId?: string; parentMessageId?: string }
    signal?: GenericAbortSignal
    onDownloadProgress?: (progressEvent: AxiosProgressEvent) => void
  },
) {
  return post<T>({
    url: `${baseUrl}/chat/completion/chat-id`,
    headers: {
      Accept: 'text/event-stream',
    },
    data: { chatId: params.chatId, agent: 'bus_agent', question: params.question, historyCount: 10 },
    signal: params.signal,
    onDownloadProgress: params.onDownloadProgress,
  })
}
export function fetchSession<T>() {
  return post<T>({
    url: '/session',
  })
}

export function fetchVerify<T>(token: string) {
  return post<T>({
    url: '/verify',
    data: { token },
  })
}

export function getCode<T>(params: any) {
  return post<T>({
    url: `${baseUrl}/auth/code?email=${params}`,
  })
}

export function registerAccount<T>(params: any) {
  return post<T>({
    url: `${baseUrl}/auth/register`,
    data: params,
  })
}

export function loginAccount<T>(params: any) {
  return post<T>({
    url: `${baseUrl}/auth/login`,
    data: params,
  })
}

export function newChat<T>(params: any) {
  return post<T>({
    url: `${baseUrl}/chat/add`,
    data: params,
  })
}

export function getCourseList<T>() {
  return get<T>({
    url: `${baseUrl}/course/list`,
  })
}

export function getStarCourses<T>() {
  return get<T>({
    url: `${baseUrl}/course/star-list`,
  })
}
export function courseStar<T>(courseId: string) {
  return post<T>({
    url: `${baseUrl}/course/star?courseId=${courseId}`,
  })
}
export function courseUnStar<T>(courseId: string) {
  return post<T>({
    url: `${baseUrl}/course/unstar?courseId=${courseId}`,
  })
}

export function coursePdfs<T>(courseId: string) {
  return get<T>({
    url: `${baseUrl}/course/pdfs?courseId=${courseId}`,
  })
}
export function pdfInfo<T>(pdfId: string) {
  return get<T>({
    url: `${baseUrl}/pdf/info?pdfId=${pdfId}`,
  })
}
export function commentRootList<T>(pdfPageId: string) {
  return get<T>({
    url: `${baseUrl}/comment/root-list?pdfPageId=${pdfPageId}`,
  })
}

export function commentStar<T>(commentId: string) {
  return post<T>({
    url: `${baseUrl}/comment/star?commentId=${commentId}`,
  })
}

export function commentUnStar<T>(commentId: string) {
  return post<T>({
    url: `${baseUrl}/comment/star?commentId=${commentId}`,
  })
}

export function commentAdd<T>(params: any) {
  return post<T>({
    url: `${baseUrl}/comment/root-add?`,
    data: params,
  })
}
export function commentAddChild<T>(params: any) {
  return post<T>({
    url: `${baseUrl}/comment/root-add`,
    data: params,
  })
}
export function commentDel<T>(commentId: string) {
  return post<T>({
    url: `${baseUrl}/comment/delete?commentId=${commentId}`,
  })
}
