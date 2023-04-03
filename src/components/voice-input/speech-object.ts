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

const uploadToken = async () => {
  try {
    const { data } = await fetchAzureToken<AzureData>()
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

export const useSpeechObject = () => {
  const isInit = ref(false)
  const isReady = ref(false)
  const allVoices = shallowRef<SpeechSynthesisVoice[]>([])
  const speechStore = useSpeechStore()

  const usedVoices = computed(() => {
    const isAzure = speechObj?.isAzure
    const baseOptions = isAzure ? langJson.auzre : langJson.default
    const voices = allVoices.value

    if (!isReady.value || !voices.length)
      return []

    const findEqualVoice = (lang: string, value: string, sameVoices: SpeechSynthesisVoice[]) => {
      if (isAzure) {
        return sameVoices.find((item) => {
          return item.name.includes(value.replace(`${lang}-`, ''))
        })
      }
      else { return sameVoices.find(item => item.name === value) }
    }

    const data: VoiceDataType[] = baseOptions.map((item) => {
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

    return data
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
    if (speechToken.token && speechToken.region) {
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
      sound = langOption.voices[0].value

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
