import { defineStore } from 'pinia'
import { getLocalState, setLocalState } from './helper'
import type { ChatState, History } from '@/views/chat/types'

export const useChatStore = defineStore('chat-store', {
  state: (): ChatState => getLocalState(),

  getters: {
    getChatByUuid(state: ChatState) {
      return (uuid?: number) => {
        if (uuid)
          return state.chat.find(item => item.uuid === uuid)?.data ?? []
        return state.chat.find(item => item.uuid === state.active)?.data ?? []
      }
    },
  },

  actions: {
    addHistory(history: History) {
      this.history.push(history)
      this.chat.push({ uuid: history.uuid, data: [] })
      this.active = history.uuid
      this.recordState()
    },

    updateHistory(uuid: number, edit: Partial<History>) {
      const index = this.history.findIndex(item => item.uuid === uuid)
      if (index !== -1) {
        this.history[index] = { ...this.history[index], ...edit }
        this.recordState()
      }
    },

    deleteHistory(uuid: number) {
      this.history = this.history.filter(item => item.uuid !== uuid)
      this.chat = this.chat.filter(item => item.uuid !== uuid)
      this.recordState()
    },

    setActive(uuid: number) {
      this.active = uuid
      this.recordState()
    },

    recordState() {
      setLocalState(this.$state)
    },
  },
})
