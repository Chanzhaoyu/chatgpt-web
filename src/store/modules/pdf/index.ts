import { defineStore } from 'pinia'
export const usePdfStore = defineStore('pdf-store', {
  state: () => ({
    currentPage: 1,
    sourceUrl: '',
  }),
  actions: {
    setCurrentPage(page: number) {
      this.currentPage = page
    },
    setSourceurl(url: string) {
      this.sourceUrl = url
    },
  },
})
