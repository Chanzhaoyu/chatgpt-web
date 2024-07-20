import axios, { type AxiosResponse } from 'axios'
import { useAuthStore } from '@/store'

const service = axios.create({
  baseURL: import.meta.env.VITE_APP_API_BASE_URL,
})

service.interceptors.request.use(
  (config) => {
    const token = useAuthStore().token
    config.headers.Authorization = '54005bd6-5a72-4ad0-b08f-8b6efbe331a7'
    if (token)
      config.headers.Authorization = `${token}`
    return config
  },
  (error) => {
    return Promise.reject(error.response)
  },
)

service.interceptors.response.use(
  (response: AxiosResponse): AxiosResponse => {
    if (response.status === 200)
      return response

    throw new Error(response.status.toString())
  },
  (error) => {
    return Promise.reject(error)
  },
)

export default service
