import { defineStore } from 'pinia'
import type { AppState } from './helper'
import { getLocalSetting, setLocalSetting } from './helper'

export const useAppStore = defineStore('app-store', {
  state: (): AppState => getLocalSetting(),
  actions: {
    setSiderCollapsed(collapsed: boolean) {
      this.siderCollapsed = collapsed
      this.recordState()
    },

    setTheme(theme: 'light' | 'dark') {
      this.theme = theme
      this.recordState()
    },

    recordState() {
      setLocalSetting(this.$state)
    },
  },
})
