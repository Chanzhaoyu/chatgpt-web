import { defineStore } from 'pinia'
import { getLocalState, removeLocalState, setLocalState } from './helper'
import type { SpeechConfig } from './helper'

export const useSpeechStore = defineStore('speech-store', {
  state: (): SpeechConfig => getLocalState(),
  actions: {
    updateStore(store: Partial<SpeechConfig>) {
      this.$state = {
        ...this.$state,
        ...store,
        speechSetting: {
          ...this.$state.speechSetting,
          ...store.speechSetting,
        },
      }
      this.recordState()
    },

    recordState() {
      setLocalState(this.$state)
    },

    removeState() {
      removeLocalState()
    },
  },
})
