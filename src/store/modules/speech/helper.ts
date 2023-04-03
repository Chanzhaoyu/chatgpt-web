import { ss } from '@/utils/storage'

const LOCAL_NAME = 'SpeechConfig'

export interface SpeechConfig {
  showTip: boolean

  autoSpeak?: boolean

  speechSetting: {
    voice?: SpeechSynthesisVoice
    lang: string
    sound?: string
    pitch: number
    rate: number
  }
}

export function defaultState(): SpeechConfig {
  return {
    showTip: true,
    autoSpeak: false,
    speechSetting: {
      lang: 'zh-CN',
      pitch: 1,
      rate: 1,
    },
  }
}

export function getLocalState(): SpeechConfig {
  const localState = ss.get(LOCAL_NAME)
  return { ...defaultState(), ...localState }
}

export function setLocalState(state?: SpeechConfig) {
  const defaultConfig = defaultState()
  const { autoSpeak: _autoSpeak, ...other } = state || {}
  const { voice: _voice, ...otherSpeechSetting } = state?.speechSetting || {}
  const newData: SpeechConfig = {
    ...defaultConfig,
    ...other,
    speechSetting: { ...defaultConfig.speechSetting, ...otherSpeechSetting },
  }
  ss.set(LOCAL_NAME, newData)
}

export function removeLocalState() {
  ss.remove(LOCAL_NAME)
}
