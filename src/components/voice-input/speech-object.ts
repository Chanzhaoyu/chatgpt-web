import createPonyfill from 'web-speech-cognitive-services'
import { computed, ref, shallowRef, watchEffect } from 'vue'
import langJson from './lang.json'
import { createLocalStorage } from '@/utils/storage'
import { fetchAzureToken } from '@/api'
import { useSpeechStore } from '@/store/modules/speech'

interface AzureData { token: string; region: string }
interface SpeechTokenType {
  token: string
  region: string
  loaded: boolean
}

export interface VoiceDataType {
  lang: string
  label: string
  voices: { value: string; label: string }[]
  source: Record<string, SpeechSynthesisVoice>
}

const LOCAL_NAME = 'speechToken'
const ss = createLocalStorage({ expire: 60 * 1 })

const defaultToken = (): SpeechTokenType => ({ token: '', region: '', loaded: false })

const getToken = (): SpeechTokenType => {
  const localState = ss.get(LOCAL_NAME)
  return { ...defaultToken(), ...localState }
}

const setToken = (data: Partial<SpeechTokenType>) => {
  const localState = ss.get(LOCAL_NAME)
  const newData: SpeechTokenType = { ...localState, ...data }
  ss.set(LOCAL_NAME, newData)
}

// 一个单例，否则会调用多次调用。
let tokenPromise: Promise<any>
const uploadToken = async () => {
  if (tokenPromise)
    return await tokenPromise

  try {
    tokenPromise = fetchAzureToken<AzureData>()
    const { data } = await tokenPromise
    setToken({ ...data, loaded: true })
  }
  catch (_e) {
    setToken({ loaded: true })
  }
}

export const NativeSpeechRecognition = typeof window !== 'undefined' && (
  window.SpeechRecognition || window.webkitSpeechRecognition || window.mozSpeechRecognition || window.msSpeechRecognition || window.oSpeechRecognition
)

interface SpeechObjectType {
  SpeechRecognition?: any
  speechSynthesis?: SpeechSynthesis
  SpeechSynthesisUtterance?: {
    prototype: SpeechSynthesisUtterance
    new(text?: string): SpeechSynthesisUtterance
  }

  isAzure?: boolean
}
let speechObj: SpeechObjectType

const getAzureVoices = (voices: SpeechSynthesisVoice[]): VoiceDataType[] => {
  const baseOptions = langJson.auzre

  const findEqualVoice = (lang: string, value: string, sameVoices: SpeechSynthesisVoice[]) => {
    return sameVoices.find((item) => {
      return item.name.includes(value.replace(`${lang}-`, ''))
    })
  }

  return baseOptions.map((item) => {
    const sameLangVoices = voices.filter(voice => voice.lang === item.lang) || []
    const sameNameVoices = item.voices.filter(voice => findEqualVoice(item.lang, voice.value, sameLangVoices)) || []

    if (sameLangVoices.length && sameNameVoices.length) {
      return {
        lang: item.lang,
        label: item.label,
        voices: sameNameVoices,
        source: sameNameVoices.reduce((prev, cur) => {
          prev[cur.value] = findEqualVoice(item.lang, cur.value, sameLangVoices) as SpeechSynthesisVoice
          return prev
        }, {} as Record<string, SpeechSynthesisVoice>),
      }
    }

    return null as unknown as VoiceDataType
  }).filter(item => !!item)
}
const getDefaultVoices = (voices: SpeechSynthesisVoice[]): VoiceDataType[] => {
  const baseOptions = langJson.default

  return baseOptions.reduce((prev, lang) => {
    const curLangVoices = voices.filter(item => item.lang === lang)

    prev.push({
      lang,
      label: lang,
      voices: curLangVoices.map(item => ({ value: item.name, label: item.name })),
      source: curLangVoices.reduce((prev, cur) => {
        prev[cur.name] = cur
        return prev
      }, {} as Record<string, SpeechSynthesisVoice>),
    })

    return prev
  }, [] as VoiceDataType[])
}

export const useSpeechObject = () => {
  const isInit = ref(false)
  const isReady = ref(false)
  const allVoices = shallowRef<SpeechSynthesisVoice[]>([])
  const speechStore = useSpeechStore()

  const usedVoices = computed(() => {
    const isAzure = speechObj?.isAzure && !speechStore.speechSetting?.useDefault

    const voices = allVoices.value

    if (!isReady.value || !voices.length)
      return []
    const voicesOptions = isAzure ? getAzureVoices(voices) : getDefaultVoices(voices)

    return voicesOptions
  })

  const awaitReady = async () => {
    let loadLangCount = 0

    const checkFn = (cb: () => void) => {
      const voices = usedVoices.value || []
      if (!voices.length && loadLangCount < 4) {
        loadLangCount++
        setTimeout(() => {
          checkFn(cb)
        }, 500)
      }
      else {
        cb()
      }
    }

    return new Promise(resolve => checkFn(() => resolve(true)))
  }

  const updateVoices = () => {
    if (speechObj.speechSynthesis) {
      const voices = speechObj.speechSynthesis.getVoices() || []
      if (voices.length) {
        isReady.value = true
        allVoices.value = voices
      }
      else {
        speechObj.speechSynthesis.onvoiceschanged = () => {
          isReady.value = true
          allVoices.value = speechObj.speechSynthesis?.getVoices() || []
        }
      }
    }
  }

  const getSpeechObject = async (): Promise<SpeechObjectType> => {
    if (!getToken().loaded) {
      await uploadToken()
    }
    else if (speechObj) {
      updateVoices()
      return speechObj
    }

    const speechToken = getToken()
    if (speechToken.token && speechToken.region && !speechStore.speechSetting?.useDefault) {
      const {
        SpeechRecognition,
        speechSynthesis,
        SpeechSynthesisUtterance,
      } = await createPonyfill({
        credentials: {
          region: speechToken.region,
          authorizationToken: speechToken.token,
        },
      })

      speechObj = {
        SpeechRecognition,
        speechSynthesis,
        SpeechSynthesisUtterance,
        isAzure: true,
      }
    }
    else {
      speechObj = {
        SpeechRecognition: NativeSpeechRecognition,
        speechSynthesis: window.speechSynthesis,
        SpeechSynthesisUtterance: window.SpeechSynthesisUtterance,
      }
    }

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    window.__speechObj = speechObj

    updateVoices()

    return speechObj
  }

  watchEffect(() => {
    const setting = speechStore.speechSetting
    let sound = setting.sound || ''
    if (!usedVoices.value.length || isInit.value)
      return

    isInit.value = true
    const langOption = usedVoices.value.find(item => item.lang === setting.lang)
     || { voices: [], source: {} as VoiceDataType['source'] }

    if (!langOption.voices.some(item => item.value === setting.sound))
      sound = langOption.voices[0]?.value

    speechStore.updateStore({
      speechSetting: {
        ...setting,
        sound,
        voice: langOption.source[sound],
      },
    })
  })

  // auto init
  getSpeechObject()
  return {
    getSpeechObject,
    awaitReady,
    usedVoices,
    isReady,
  }
}
