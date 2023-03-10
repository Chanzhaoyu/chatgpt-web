import { defineStore } from 'pinia'
import { getToken, removeToken, setToken } from './helper'
import { store } from '@/store'
import { fetchUser } from '@/api'

export interface AuthState {
  token: string | undefined
  user: UserInfo | null
}

export const useAuthStore = defineStore('auth-store', {
  state: (): AuthState => ({
    token: getToken(),
    user: null,
  }),

  actions: {
    async getUserInfo() {
      try {
        if (!this.token)
          return Promise.reject(new Error('请先登录'))
        const { data } = await fetchUser<UserInfo>(this.token)
        this.user = { ...data }
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
      this.user = null
      this.token = undefined
      removeToken()
    },
  },
})

export function useAuthStoreWithout() {
  return useAuthStore(store)
}
