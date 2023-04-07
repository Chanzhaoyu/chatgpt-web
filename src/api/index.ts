import type { AxiosProgressEvent, GenericAbortSignal } from 'axios'
import { SSE } from 'sse.js'
import { post } from '@/utils/request'
import { useAuthStore, useSettingStore } from '@/store'

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

export interface StreamMessage {
  id: string
  csid?: string
  pmid?: string
  delta: string
  text?: string
  finishReason?: string
}

export function fetchChatStream(
  params: {
    prompt: string
    csid?: string
    options?: { conversationId?: string; parentMessageId?: string }
    onAbort?: (event: Event) => void
    onError?: (event: Event) => void
    onMessage: (msg: StreamMessage) => void
    signal?: GenericAbortSignal
  },
) {
  let csid = params.csid || params.options?.conversationId || ''
  const headers: { [key: string]: string } = { 'Content-Type': 'application/json' }
  const settingStore = useSettingStore()
  const token = useAuthStore().token
  if (token)
    headers.Authorization = `Bearer ${token}`

  const eventSource = new SSE('/api/chat-sse', {
    headers,
    payload: JSON.stringify({
      csid,
      prompt: params.prompt,
      options: params.options,
      systemMessage: settingStore.systemMessage,
    }),
  })

  const { onMessage, onError, onAbort, signal } = params

  const receiveMessage = (e: MessageEvent) => {
    if (!csid && eventSource.xhr)
      csid = eventSource.xhr.getResponseHeader('Conversation-ID')

    if (e.data.length === 0)
      return

    if (e.data === '[DONE]')
      return

    const cr = JSON.parse(e.data)
    if (cr.choices && cr.choices.length > 0) // for old response
      cr.delta = cr.choices[0].delta.content

    if (csid && !cr.csid)
      cr.csid = csid

    onMessage(cr)
  }

  eventSource.addEventListener('message', receiveMessage)

  if (onError)
    eventSource.addEventListener('error', onError)

  if (onAbort)
    eventSource.addEventListener('abort', onAbort)
  else if (signal)
    eventSource.addEventListener('abort', signal.onabort)

  eventSource.stream()
}

// Deprecated: by fetchChatStream
export function fetchChatAPIProcess<T = any>(
  params: {
    prompt: string
    options?: { conversationId?: string; parentMessageId?: string }
    signal?: GenericAbortSignal
    onDownloadProgress?: (progressEvent: AxiosProgressEvent) => void },
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
