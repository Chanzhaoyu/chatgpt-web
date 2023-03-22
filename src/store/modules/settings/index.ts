import { defineStore } from 'pinia'
import type { SettingsState } from './helper'
import { defaultSetting, getLocalState, setLocalState } from './helper'

export const useSettingStore = defineStore('setting-store', {
  state: (): SettingsState => getLocalState(),
  actions: {
    updateSetting(settings: Partial<SettingsState>) {
      this.$state = { ...this.$state, ...settings }
      this.recordState()
    },

    resetSetting() {
      this.$state = defaultSetting()
      this.recordState()
    },

    recordState() {
      setLocalState(this.$state)
    },
  },
})
