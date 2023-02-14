import { defineStore } from 'pinia'
import type { AppState } from './helper'
import { getLocalSetting, setLocalSetting } from './helper'

export const useAppStore = defineStore('app-store', {
  state: (): AppState => getLocalSetting(),
  actions: {
    setSiderCollapsed(collapsed: boolean) {
      this.siderCollapsed = collapsed
      setLocalSetting(this.$state)
    },
    toggleSiderCollapse() {
      this.setSiderCollapsed(!this.siderCollapsed)
    },
  },
})
