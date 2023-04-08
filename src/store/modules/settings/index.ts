import { defineStore } from 'pinia'
import type { SettingsState } from './helper'
import { defaultSetting, getLocalState, removeLocalState, setLocalState } from './helper'

export const useSettingStore = defineStore('setting-store', {
  state: (): SettingsState => getLocalState(),

  getters: {
    currentChatConfig(state: SettingsState) {
      return (uuid: number): Chat.ConversationConfig => {
        const searchResult: Chat.ConversationConfig | undefined = state.perChatSettings.find(item => item.uuid === uuid)?.settings
        // if no search result
        if (!searchResult) {
          return {
            systemMessage: state.systemMessage,
            temperature: state.temperature,
            top_p: state.top_p,
          }
        }
        else {
          return searchResult
        }
      }
    },
    getDefaultSystemMessage(state: SettingsState) {
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

    setChatConfig(uuid: number, config: Chat.ConversationConfig) {
      const index = this.perChatSettings.findIndex(item => item.uuid === uuid)
      if (index !== -1) {
        this.perChatSettings[index] = {
          ...this.perChatSettings[index],
          ...{ settings: config },
        }
      }
      else {
        this.perChatSettings.push({ uuid, settings: config })
      }
      this.recordState()
    },

    restoreDefaultChatConfig(uuid: number) {
      const index = this.perChatSettings.findIndex(item => item.uuid === uuid)
      if (index !== -1) {
        this.perChatSettings.splice(index, 1)
        this.recordState()
      }
    },

    resetChatConfig() {
      this.perChatSettings = []
      this.recordState()
    },

    recordState() {
      setLocalState(this.$state)
    },
  },
})
