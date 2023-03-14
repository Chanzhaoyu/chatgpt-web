import axios, { type AxiosResponse } from 'axios'
import { useAuthStore } from '@/store'

axios.defaults.withCredentials = true

const service = axios.create({
  baseURL: import.meta.env.VITE_GLOB_API_URL,
})

service.interceptors.request.use(
  async (config) => {
    const { token, getUsertoken } = useAuthStore()
    if (token) {
      config.headers['Access-Token'] = `${token}`
    }
    else {
      const headers = await getUsertoken()
      if (headers)
        config.headers.authorization = `${headers.authorization}`
    }
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
