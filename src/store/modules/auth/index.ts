import { defineStore } from 'pinia'
import { getToken, removeToken, setToken } from './helper'
import { fetchChatConfig } from '@/api'
import { store } from '@/store'

export interface AuthState {
  token: string | undefined
  config: {
    apiModel?: string
    authorized?: '1' | '0'
    reverseProxy?: string
    timeoutMs?: string
    socksProxy?: string
  } | undefined
}

export const useAuthStore = defineStore('auth-store', {
  state: (): AuthState => ({
    token: getToken(),
    config: undefined,
  }),

  actions: {
    async fetchConfig() {
      try {
        const { data } = await fetchChatConfig()
        this.config = { ...data }
        return Promise.resolve(data)
      }
      catch (error) {
        return Promise.reject(error)
      }
    },

    setToken(token: string) {
      this.token = token
      setToken(token)
    },

    removeToken() {
      this.token = undefined
      removeToken()
    },
  },
})

export function useAuthStoreWithout() {
  return useAuthStore(store)
}
