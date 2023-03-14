import { defineStore } from 'pinia'
import jwt_decode from 'jwt-decode'
import { getToken, removeToken, setToken } from './helper'
import { store, useUserStore } from '@/store'
import { fetchSession } from '@/api'

export interface AuthState {
  token: string | undefined
  session: { auth: boolean; allowRegister: boolean } | null
}

export const useAuthStore = defineStore('auth-store', {
  state: (): AuthState => ({
    token: getToken(),
    session: null,
  }),

  actions: {
    async getSession() {
      try {
        const { data } = await fetchSession<{ auth: boolean; allowRegister: boolean }>()
        this.session = { ...data }
        return Promise.resolve(data)
      }
      catch (error) {
        return Promise.reject(error)
      }
    },

    setToken(token: string) {
      this.token = token
      const decoded = jwt_decode(token) as { email: string }
      const userStore = useUserStore()
      userStore.updateUserInfo({
        avatar: '',
        name: decoded.email,
        description: '',
      })
      setToken(token)
    },

    removeToken() {
      this.token = undefined
      const userStore = useUserStore()
      userStore.resetUserInfo()
      removeToken()
    },
  },
})

export function useAuthStoreWithout() {
  return useAuthStore(store)
}
