import { defineStore } from 'pinia'
import { getToken, removeToken, setToken } from './helper'
import { store } from '@/store'
import { fetchUser } from '@/api'

export interface AuthState {
  token: string | undefined
  user: UserInfo | null
}
interface IHeader {
  authorization: string
}
export const useAuthStore = defineStore('auth-store', {
  state: (): AuthState => ({
    token: getToken(),
    user: null,
  }),

  actions: {
    async getUserInfo() {
      try {
        const { data } = await fetchUser<UserInfo>()
        this.user = { ...data }
        return Promise.resolve(data)
      }
      catch (error) {
        return Promise.reject(error)
      }
    },
    getUsertoken() {
      return new Promise<IHeader | null>((resolve, reject) => {
        // eslint-disable-next-line no-console
        console.log('window.mingle:', window.mingle)
        if (window.mingle) {
          window.mingle.invoke('buildHeaders', null, (secret: string) => {
            try {
              resolve(JSON.parse(secret))
            }
            catch (error) {
              resolve(null)
            }
          })
        }
        else { resolve(null) }
      })
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
