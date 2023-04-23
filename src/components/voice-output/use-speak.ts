import { onUnmounted, ref } from 'vue'
import { useMessage } from 'naive-ui'
import { useSpeechStore } from '@/store/modules/speech'
import { useSpeechObject } from '@/components/voice-input/speech-object'

let synth: SpeechSynthesis | undefined
export const useSpeak = () => {
  const message = useMessage()
  const { getSpeechObject, awaitReady } = useSpeechObject()
  let voiceSynthesis: SpeechSynthesisUtterance | null = null
  const ttsStore = useSpeechStore()

  const isSpeaking = ref(false)

  const onstart = () => isSpeaking.value = true
  const onend = () => isSpeaking.value = false

  const cleanVoice = () => {
    if (voiceSynthesis) {
      voiceSynthesis.onstart = null
      voiceSynthesis.onend = null
      voiceSynthesis.onerror = null
      voiceSynthesis = null
    }
  }

  const cancelSpeak = () => {
    onend()
    synth?.cancel()
  }

  const getVoice = async (text: string) => {
    const { SpeechSynthesisUtterance, speechSynthesis } = await getSpeechObject()
    await awaitReady()
    if (!voiceSynthesis) {
      if (!SpeechSynthesisUtterance || !speechSynthesis)
        return

      synth = speechSynthesis
      voiceSynthesis = new SpeechSynthesisUtterance(text)
      voiceSynthesis.onstart = onstart
      voiceSynthesis.onend = onend
      voiceSynthesis.onerror = (event) => {
        cancelSpeak()
        cleanVoice()
        window?.loggerDebugger(event.error.toString())
      }
    }

    voiceSynthesis.text = text
    if (ttsStore.speechSetting.voice?.name)
      voiceSynthesis.voice = ttsStore.speechSetting.voice

    voiceSynthesis.pitch = ttsStore.speechSetting.pitch
    voiceSynthesis.rate = ttsStore.speechSetting.rate

    return voiceSynthesis
  }

  const speak = async (text?: string) => {
    if (!text)
      return

    else if (synth?.speaking && !ttsStore.autoSpeak)
      cancelSpeak()

    const utterance = await getVoice(text)
    if (!utterance || !synth) {
      message.warning('当前浏览器不支持语音功能！')
      return
    }
    synth?.speak(utterance)
  }

  onUnmounted(() => {
    cancelSpeak()
    cleanVoice()
  })

  return {
    isSpeaking,
    speak,
    cancelSpeak,
  }
}
