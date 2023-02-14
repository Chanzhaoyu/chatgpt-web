import { defineStore } from 'pinia'

interface AppState {
  siderCollapsed: boolean
}

export const useAppStore = defineStore('app-store', {
  state: (): AppState => ({
    siderCollapsed: false,
  }),
  actions: {
    setSiderCollapsed(collapsed: boolean) {
      this.siderCollapsed = collapsed
    },
    toggleSiderCollapse() {
      this.siderCollapsed = !this.siderCollapsed
    },
  },
})
