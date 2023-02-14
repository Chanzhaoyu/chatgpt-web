import { defineStore } from 'pinia'
import type { AppState } from './helper'
import { getAppSetting, setAppSetting } from './helper'

export const useAppStore = defineStore('app-store', {
  state: (): AppState => getAppSetting(),
  actions: {
    setSiderCollapsed(collapsed: boolean) {
      this.siderCollapsed = collapsed
      setAppSetting(this.$state)
    },
    toggleSiderCollapse() {
      this.setSiderCollapsed(!this.siderCollapsed)
    },
  },
})
