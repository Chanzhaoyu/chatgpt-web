import { defineStore } from 'pinia'
import type { HistoryState } from './helper'
import { getLocalHistory, setLocalHistory } from './helper'

export const useHistoryStore = defineStore('history-store', {
  state: (): HistoryState => getLocalHistory(),
  getters: {
    getCurrentChat(state): Chat.Chat[] {
      if (state.historyChat.length) {
        if (state.active === null || state.active >= state.historyChat.length || state.active < 0)
          state.active = 0
        return state.historyChat[state.active].data ?? []
      }
      state.active = null
      return []
    },
  },
  actions: {
    addChat(data: Chat.Chat) {
      if (this.active === null) {
        this.historyChat.push({ title: data.message, isEdit: false, data: [data] })
        this.active = this.historyChat.length - 1
      }
      else {
        if (this.historyChat[this.active].title === '')
          this.historyChat[this.active].title = data.message
        this.historyChat[this.active].data.push(data)
      }
      setLocalHistory(this.$state)
    },

    clearChat() {
      if (this.active !== null) {
        this.historyChat[this.active].data = []
        setLocalHistory(this.$state)
      }
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
      if (this.active === index) {
        if (this.historyChat.length === 0)
          this.active = null
        else if (this.active === this.historyChat.length)
          this.active--
        else
          this.active = 0
      }
      setLocalHistory(this.$state)
    },

    chooseHistory(index: number) {
      this.active = index
      setLocalHistory(this.$state)
    },
  },
})
