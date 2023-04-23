import { ss } from '@/utils/storage'

const LOCAL_NAME = 'SpeechConfig'
const enableSpeech = import.meta.env.VITE_ENABLE_SPEECH === 'true'

export interface SpeechConfig {
  enable?: boolean // 是否启用，不存入 ss
  showTip: boolean // 是否显示语音输入的指令提示

  autoSpeak?: boolean // 是否自动播放，不存入 ss

  speechSetting: {
    // 一个语音的原生对象，不存入 ss
    voice?: SpeechSynthesisVoice
    lang: string
    sound?: string
    pitch: number
    rate: number
  }
}

export function defaultState(): SpeechConfig {
  return {
    enable: enableSpeech,
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
  const defaultConfig = defaultState()
  const localState = ss.get(LOCAL_NAME)
  return {
    ...defaultConfig,
    ...localState,
    enable: enableSpeech,
    speechSetting: {
      ...defaultConfig.speechSetting,
      ...localState.speechSetting,
    },
  }
}

export function setLocalState(state?: SpeechConfig) {
  const defaultConfig = defaultState()
  const { enable: _enable, autoSpeak: _autoSpeak, ...other } = state || {}
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
