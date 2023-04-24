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
const language = ref('vi-VN')
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
    message.warning('Trình duyệt hiện tại không hỗ trợ chức năng đàm thoại!')
    return
  }

  recognition = new SpeechRecognition()
  // recognition = new NativeSpeechRecognition()
  recognition.interimResults = true // 开启实时识别
  recognition.continuous = true
  recognition.onstart = () => logger('init recognition')
  recognition.onerror = (e: any) => {
    logger('Xác định sai！')
    window.loggerDebugger(e?.error?.toString() ?? e.toString())
  }
  recognition.onend = () => {
    logger('Tại sao đã kết thúc？')
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
    message.success('Bật giọng nói！')
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
  logger('Dừng sử dụng giọng nói')
  message.warning('Tắt tiếng！')
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
    logger(`Bây giờ đang ghi lại câu thứ [${resultIndex}]，đã ghi lại${sentences.value.length}câu，cmdKey: ${cmdKey}, isFinal:${resultItem?.isFinal}`, resStr)

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
    title="Giọng nói tips"
    :mask-closable="false"
    positive-text="OK"
    negative-text="Không cần"
    :closable="false"
    :close-on-esc="false"
    @positive-click="onPositiveClick"
    @negative-click="onNegativeClick"
  >
    <NAlert type="default" title="Hướng dẫn sử dụng">
      Sau khi kích hoạt chức năng giọng nói, bạn có thể nhập nội dung thông qua giọng nói và tương tác với ChatGPT tốt hơn. Để sử dụng hiệu quả, chúng tôi cung cấp một số lệnh giọng nói để bạn có thể giao tiếp với ChatGPT một cách dễ dàng hơn:
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
