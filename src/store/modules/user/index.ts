import { defineStore } from 'pinia'
import type { UserInfo, UserState } from './helper'
import { defaultSetting, getLocalState, setLocalState } from './helper'

export const useUserStore = defineStore('user-store', {
  state: (): UserState => getLocalState(),
  actions: {
    updateUserInfo(userInfo: Partial<UserInfo>) {
      this.userInfo = { ...this.userInfo, ...userInfo }
      this.recordState()
    },

    resetUserInfo() {
      this.userInfo = { ...defaultSetting().userInfo }
      this.recordState()
    },

    recordState() {
      setLocalState(this.$state)
    },

    async setupUserInfo() {
      const response = await fetch('/api/user')
      const data = await response.json()
      const user = data?.result

      if (user) {
        this.userInfo = {
          avatar: user.avatar,
          name: user.nickname,
          description: user.description,
        }
      }
    },
  },
})
