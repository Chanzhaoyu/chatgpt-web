import { defineStore } from 'pinia'
import type { SettingsState } from './helper'
import { defaultSetting, getLocalState, removeLocalState, setLocalState } from './helper'

export const useSettingStore = defineStore('setting-store', {
  state: (): SettingsState => getLocalState(),
  actions: {
    updateSetting(settings: Partial<SettingsState>) {
      if (settings.presence_penalty !== undefined && (settings.presence_penalty < -2.0 || settings.presence_penalty > 2.0))
        throw new Error('presence_penalty must be between -2.0 and 2.0')

      if (settings.frequency_penalty !== undefined && (settings.frequency_penalty < -2.0 || settings.frequency_penalty > 2.0))
        throw new Error('frequency_penalty must be between -2.0 and 2.0')

      this.$state = { ...this.$state, ...settings }
      this.recordState()
    },

    resetSetting() {
      this.$state = defaultSetting()
      removeLocalState()
    },

    recordState() {
      setLocalState(this.$state)
    },
  },
})
