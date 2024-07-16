import { defineStore } from 'pinia'
export const useMyStore = defineStore('my-store', {
  state: () => ({
    currentOption: 'profile',
  }),
  actions: {
    setCurrentOption(option: string) {
      this.currentOption = option
    },
  },
})
