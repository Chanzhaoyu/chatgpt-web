import type { AxiosProgressEvent, GenericAbortSignal } from 'axios'
import type { CreateModelReq } from './types'
import { get, post } from '@/utils/request'
import { useSettingStore } from '@/store'

export function fetchChatAPI<T = any>(
  prompt: string,
  options?: { conversationId?: string; parentMessageId?: string },
  signal?: GenericAbortSignal,
) {
  return post<T>({
    url: '/api/chat',
    data: { prompt, options },
    signal,
  })
}

export function fetchChatConfig<T = any>() {
  return post<T>({
    url: '/api/config',
  })
}

export function fetchChatAPIProcess<T = any>(
  params: {
    prompt: string
    options?: { conversationId?: string; parentMessageId?: string }
    completionParams?: Chat.CompletionParams
    signal?: GenericAbortSignal
    onDownloadProgress?: (progressEvent: AxiosProgressEvent) => void },
) {
  const settingStore = useSettingStore()

  return post<T>({
    url: '/api/chat-process',
    data: {
      prompt: params.prompt,
      options: params.options,
      systemMessage: settingStore.systemMessage,
      completionParams: params.completionParams,
    },
    signal: params.signal,
    onDownloadProgress: params.onDownloadProgress,
  })
}

export function fetchSession<T>() {
  return post<T>({
    url: '/api/session',
  })
}

export function fetchVerify<T>(token: string) {
  return post<T>({
    url: '/api/verify',
    data: { token },
  })
}

export function fetchModels<T>() {
  return post<T>({
    url: '/api/models',
  })
}

export function fetchList<T>() {
  return get<T>({
    url: '/api/list',
  })
}

export function fetchModelDetail<T>(id: string) {
  return post<T>({
    url: '/api/model-detail',
    data: {
      fine_tune_id: id,
    },
  })
}

export function prepareData<T>(formData: FormData) {
  return post<T>({
    url: '/api/prepare-data',
    data: formData,
    headers: {
      'Content-type': 'multipart/form-data;charset=UTF-8',
    },
  })
}

export function createModel<T>(params: CreateModelReq) {
  return post<T>({
    url: '/api/create-model',
    data: params,
  })
}
