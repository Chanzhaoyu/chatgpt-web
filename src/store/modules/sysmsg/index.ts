import { defineStore } from 'pinia'
import { getSysMsg, setSysMsg } from './helper'
import type { SystemMessage } from './helper'

export const useSysMsgStore = defineStore('sysmsg-store', {
  state: (): SystemMessage => getSysMsg(),

  getters: {
    currentSystemMessage(state: SystemMessage) {
      return (uuid: number): string => {
        const searchResult = state.chatSystemMessage.find(item => item.uuid === uuid)?.message
        // if no search result
        if (!searchResult)
          return state.default
        else
          return searchResult
      }
    },
    defaultSystemMessage(state: SystemMessage): string {
      return state.default
    },
  },

  actions: {
    setCurrentSystemMessage(uuid: number, message: string) {
      const index = this.chatSystemMessage.findIndex(item => item.uuid === uuid)
      if (index !== -1)
        this.chatSystemMessage[index] = { ...this.chatSystemMessage[index], ...{ message } }
      else
        this.chatSystemMessage.push({ uuid, message })
      this.recordState()
    },

    restoreDefaultSystemMessage(uuid: number) {
      const index = this.chatSystemMessage.findIndex(item => item.uuid === uuid)
      if (index !== -1) {
        this.chatSystemMessage.splice(index, 1)
        this.recordState()
      }
    },

    recordState() {
      setSysMsg(this.$state)
    },
  },
})
