<script setup lang='ts'>
import { computed, onUnmounted, ref } from 'vue'
import { NAlert, NDescriptions, NDescriptionsItem, NModal, useMessage } from 'naive-ui'
import { commandType, deleteLast, emptySentences, getCmdKey, getLanguage, logger, replaceSymbol, tips } from './utils'
import { useSpeechObject } from './speech-object'
import { HoverButton, SvgIcon } from '@/components/common'
import { useSpeechStore } from '@/store/modules/speech'
const props = defineProps<Props>()

const emit = defineEmits<Emit>()

interface Props {
  isLoading: boolean
}

interface Emit {
  (ev: 'onChange', value: string[]): void
  (ev: 'reset'): void
  (ev: 'submit'): void
}

const speechStore = useSpeechStore()
const enableVoice = ref(false)
const isShowModal = ref(false)
const voiceIcon = computed(() => enableVoice.value ? 'material-symbols:auto-detect-voice-outline' : 'ic:round-keyboard-voice')
const sentences = ref<string[]>([])
const language = ref('zh-CN')
const showTip = ref(false)
const { getSpeechObject } = useSpeechObject()

let recognition: any = null
const message = useMessage()

window.loggerDebugger = (msg: string) => {
  if (location.search.includes('debugger'))
    message.error(msg)
}

const changeEnableVoice = () => {
  enableVoice.value = !enableVoice.value

  if (enableVoice.value) {
    if (isShowModal.value || !speechStore.showTip)
      startRecording()
    else
      showTip.value = true
  }
  else {
    stopRecording()
  }
}
const initRecognition = async () => {
  const { SpeechRecognition } = await getSpeechObject()
  if (!SpeechRecognition) {
    message.warning('当前浏览器不支持语音功能！')
    return
  }

  recognition = new SpeechRecognition()
  // recognition = new NativeSpeechRecognition()
  recognition.interimResults = true // 开启实时识别
  recognition.continuous = true
  recognition.onstart = () => logger('init recognition')
  recognition.onerror = (e: any) => {
    logger('识别错误了！')
    window.loggerDebugger(e?.error?.toString() ?? e.toString())
  }
  recognition.onend = () => {
    logger('为啥终止了？')
    changeEnableVoice()
  }

  handleRecognitionResult()
}
const startRecording = async () => {
  if (!recognition)
    await initRecognition()

  if (recognition) {
    sentences.value = [] // 清空已有的句子
    recognition.lang = language.value
    recognition.start()
    message.success('语音开启！')
  }
}
// 结束录音
const stopRecording = () => {
  sentences.value = []
  if (!recognition)
    return
  // recognition.stop() // 停止录音
  recognition.abort() // 停止录音
  recognition.onstart = null
  recognition.onerror = null
  recognition.onend = null
  recognition.onresult = null
  recognition = null
  logger('停止语音')
  message.warning('语音关闭！')
}
// 监听语音识别结果
const handleRecognitionResult = () => {
  recognition.onresult = (event: any) => {
    // event.resultIndex 是系统判断的完成句子，停顿比较就就会切换到下一句
    const resultIndex = event.resultIndex === undefined ? event.results.length - 1 : event.resultIndex
    const resultItem = event.results?.[resultIndex]
    const interimTranscript = (resultItem?.[0]?.transcript || '')
      .replace(/[&/\\#,+()!$~%.'":*?<>{}]/g, '')
      .replace(/[。]/g, '')
      .replace(/  +/g, ' ')

    let resStr = replaceSymbol(interimTranscript)
    const { cmdKey, str: newStr = resStr } = getCmdKey(resStr) || {}
    resStr = newStr

    // 最新的一句 resultIndex 不变
    sentences.value.splice(resultIndex, 1, resStr)
    emit('onChange', sentences.value)
    logger(`当前第[${resultIndex}]句，记录${sentences.value.length}句，cmdKey: ${cmdKey}, isFinal:${resultItem?.isFinal}`, resStr)

    switch (cmdKey) {
      case commandType.clear:
        emptySentences(sentences)
        break
      case commandType.deleteLast:
        resultItem.isFinal && deleteLast({ str: resStr, sentences })
        break
      case commandType.reset:
        emptySentences(sentences)
        emit('reset')
        break
      case commandType.stop:
        changeEnableVoice()
        break
      case commandType.submit:
        if (!props.isLoading && resultItem.isFinal) {
          emit('submit')
          emptySentences(sentences)
        }
        break
      case commandType.switchLang:
        switchLang(getLanguage(interimTranscript))
        break
      default:
    }
    emit('onChange', sentences.value)
  }
}
const switchLang = (lang?: string) => {
  if (lang) {
    language.value = lang
    changeEnableVoice()
    setTimeout(() => {
      changeEnableVoice()
    }, 1000)
  }
}

const onNegativeClick = () => {
  speechStore.updateStore({ showTip: false })
  showTip.value = false
  isShowModal.value = true
  startRecording()
}
const onPositiveClick = () => {
  showTip.value = false
  isShowModal.value = true
  startRecording()
}
onUnmounted(() => changeEnableVoice())
</script>

<script lang='ts'>
export default {
  name: 'VoiceInput',
}
</script>

<template>
  <HoverButton>
    <span class="text-xl text-[#4f555e] dark:text-white" :class="enableVoice ? 'text-pink-700' : 'dark:text-white'">
      <SvgIcon :icon="voiceIcon" @click="changeEnableVoice" />
    </span>
  </HoverButton>
  <NModal
    v-model:show="showTip"
    style="width: 75%; max-width: 640px;"
    preset="dialog"
    title="语音输入 tips"
    :mask-closable="false"
    positive-text="OK"
    negative-text="不在提示"
    :closable="false"
    :close-on-esc="false"
    @positive-click="onPositiveClick"
    @negative-click="onNegativeClick"
  >
    <NAlert type="default" title="使用说明">
      开启语音功能后，就可以通过语音来输入内容，能更好的与 chatgpt 聊天。为了更好的操作，提供了一些语音指令，以方便你与 chatgpt 交流：
    </NAlert>
    <NDescriptions label-placement="left" bordered :column="1" style="max-height: 40vh;overflow: auto">
      <NDescriptionsItem v-for="item in tips" :key="item.label" label-style="width: 80px">
        <template #label>
          {{ item.label }}
        </template>
        {{ item.value }}
      </NDescriptionsItem>
    </NDescriptions>
  </NModal>
</template>
