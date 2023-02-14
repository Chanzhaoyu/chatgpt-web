import { defineStore } from 'pinia'

interface HistoryState {
  list: any[]
}

export const useHistoryStore = defineStore('history-store', {
  state: (): HistoryState => ({
    list: [],
  }),
  actions: {},
})
