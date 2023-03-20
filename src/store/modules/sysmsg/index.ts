import { defineStore } from 'pinia'
import { getSysMsg, setSysMsg } from './helper'
import type { SystemMessage } from './helper'

export const useSysMsgStore = defineStore('sysmsg-store', {
  state: (): SystemMessage => getSysMsg(),

  getters: {
    currentSystemMessage(state: SystemMessage): string {
      return state.current.length > 1 ? state.current : state.default
    },
    defaultSystemMessage(state: SystemMessage): string {
      return state.default
    },
  },

  actions: {
    setCurrentSystemMessage(message: string) {
      this.current = message
      this.recordState()
    },

    restoreDefaultSystemMessage() {
      this.current = ''
      this.recordState()
    },

    recordState() {
      setSysMsg(this.$state)
    },
  },
})
