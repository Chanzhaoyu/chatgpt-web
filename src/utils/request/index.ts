import type { AxiosResponse, GenericAbortSignal } from 'axios'
import request from './axios'

export interface HttpOption {
  url: string
  data?: any
  method?: string
  headers?: any
  signal?: GenericAbortSignal
  beforeRequest?: () => void
  afterRequest?: () => void
}

export interface ExtraOption {
  notification?: boolean
}

export interface Response<T = any> {
  data: T
  message: string | null
  status: string
}

function http<T = any>({ url, data, method, headers, signal, beforeRequest, afterRequest }: HttpOption) {
  const successHandler = (res: AxiosResponse<Response<T>>) => {
    if (res.data.status === 'Success')
      return res.data

    return Promise.reject(res.data)
  }

  const failHandler = (error: Response<Error>) => {
    afterRequest?.()
    throw new Error(error?.message || 'Error')
  }

  beforeRequest?.()

  method = method || 'GET'

  const params = Object.assign(typeof data === 'function' ? data() : data ?? {}, {})

  return method === 'GET'
    ? request.get(url, { params, signal }).then(successHandler, failHandler)
    : request.post(url, params, { headers, signal }).then(successHandler, failHandler)
}

export function get<T = any>(
  { url, data, method = 'GET', signal, beforeRequest, afterRequest }: HttpOption,
): Promise<Response<T>> {
  return http<T>({
    url,
    method,
    data,
    signal,
    beforeRequest,
    afterRequest,
  })
}

export function post<T = any>(
  { url, data, method = 'POST', headers, signal, beforeRequest, afterRequest }: HttpOption,
): Promise<Response<T>> {
  return http<T>({
    url,
    method,
    data,
    headers,
    signal,
    beforeRequest,
    afterRequest,
  })
}

export default post
