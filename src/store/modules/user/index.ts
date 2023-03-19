import { defineStore } from 'pinia'
import { fetchUpdateUserInfo } from '../../../api/'
import type { UserInfo, UserState } from './helper'
import { defaultSetting, getLocalState, setLocalState } from './helper'

export const useUserStore = defineStore('user-store', {
  state: (): UserState => getLocalState(),
  actions: {
    async updateUserInfo(update: boolean, userInfo: Partial<UserInfo>) {
      this.userInfo = { ...this.userInfo, ...userInfo }
      this.recordState()
      if (update)
        await fetchUpdateUserInfo(userInfo.name ?? '', userInfo.avatar ?? '', userInfo.description ?? '')
    },

    resetUserInfo() {
      this.userInfo = { ...defaultSetting().userInfo }
      this.recordState()
    },

    recordState() {
      setLocalState(this.$state)
    },
  },
})
