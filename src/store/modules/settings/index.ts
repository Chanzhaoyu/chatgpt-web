import { defineStore } from 'pinia'
import type { SettingsState } from './helper'
import { defaultSetting, getLocalState, removeLocalState, setLocalState } from './helper'

export const useSettingStore = defineStore('setting-store', {
  state: (): SettingsState => getLocalState(),

  getters: {
    currentSystemMessage(state: SettingsState) {
      return (uuid: number): string => {
        const searchResult = state.systemMessageAllChat.find(item => item.uuid === uuid)?.message
        // if no search result
        if (!searchResult)
          return state.systemMessage
        else
          return searchResult
      }
    },
    defaultSystemMessage(state: SettingsState): string {
      return state.systemMessage
    },
  },

  actions: {
    updateSetting(settings: Partial<SettingsState>) {
      this.$state = { ...this.$state, ...settings }
      this.recordState()
    },

    resetSetting() {
      this.$state = defaultSetting()
      removeLocalState()
    },

    setCurrentSystemMessage(uuid: number, message: string) {
      const index = this.systemMessageAllChat.findIndex(item => item.uuid === uuid)
      if (index !== -1)
        this.systemMessageAllChat[index] = { ...this.systemMessageAllChat[index], ...{ message } }
      else
        this.systemMessageAllChat.push({ uuid, message })
      this.recordState()
    },

    restoreDefaultSystemMessage(uuid: number) {
      const index = this.systemMessageAllChat.findIndex(item => item.uuid === uuid)
      if (index !== -1) {
        this.systemMessageAllChat.splice(index, 1)
        this.recordState()
      }
    },

    recordState() {
      setLocalState(this.$state)
    },
  },
})
