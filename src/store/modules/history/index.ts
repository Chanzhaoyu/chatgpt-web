import { defineStore } from 'pinia'
import type { HistoryState } from './helper'
import { getLocalHistory, setLocalHistory } from './helper'
export const useHistoryStore = defineStore('history-store', {
  state: (): HistoryState => getLocalHistory(),
  getters: {
    getCurrentHistory(state): Chat.HistoryChat {
      if (state.historyChat.length) {
        if (state.active === null || state.active >= state.historyChat.length || state.active < 0)
          state.active = 0
        return state.historyChat[state.active] ?? { title: '', isEdit: false, data: [] }
      }
      state.active = null
      return { title: '', isEdit: false, data: [] }
    },
    getCurrentChat(): Chat.Chat[] {
      return this.getCurrentHistory.data ?? []
    },
  },
  actions: {
    addChat(data: Chat.Chat, uuid: number | null = null) {
      if (this.active === null) {
        this.historyChat.push({ title: data.message, isEdit: false, data: [data] })
        this.active = this.historyChat.length - 1
      }
      else {
        const active = uuid !== null ? uuid : this.active
        if (this.historyChat[active].title === 'New Chat')
          this.historyChat[active].title = data.message
        this.historyChat[active].data.push(data)
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
      if (this.active === index)
        return
      this.active = index
      setLocalHistory(this.$state)
    },
  },
})
