import { defineStore } from 'pinia'
import type { HistoryState } from './helper'
import { getLocalHistory, setLocalHistory } from './helper'

export const useHistoryStore = defineStore('history-store', {
  state: (): HistoryState => getLocalHistory(),
  getters: {
    getCurrentChat(state): Chat.Chat[] {
      if (state.historyChat.length === 0)
        return []

      if (state.active === null)
        state.active = state.historyChat.length - 1

      return state.historyChat[state.active].data
    },
  },
  actions: {
    addChat(data: Chat.Chat) {
      if (this.active !== null) {
        this.historyChat[this.active].data.push(data)
        this.active = this.historyChat.length - 1
        setLocalHistory(this.$state)
      }
    },

    clearChat() {
      if (this.active !== null) {
        this.historyChat[this.active].data = []
        setLocalHistory(this.$state)
      }
    },

    chooseHistory(index: number) {
      this.active = index
      setLocalHistory(this.$state)
    },

    addHistory(data: Chat.HistoryChat) {
      this.historyChat.push(data)
      this.active = this.historyChat.length - 1
      setLocalHistory(this.$state)
    },

    editHistory(index: number, isEdit: boolean) {
      this.historyChat[index].isEdit = isEdit
      setLocalHistory(this.$state)
    },

    removeHistory(index: number) {
      this.historyChat.splice(index, 1)
      setLocalHistory(this.$state)
    },
  },
})
