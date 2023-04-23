<script setup lang="ts">
import { computed } from 'vue'
import { useMessage } from 'naive-ui'
import { HoverButton, SvgIcon } from '@/components/common'
import { useSpeechStore } from '@/store/modules/speech'
import { useSpeak } from '@/components/voice-output/use-speak'

const ttsStore = useSpeechStore()
const { cancelSpeak } = useSpeak()
const message = useMessage()

const voiceIcon = computed(() => ttsStore.autoSpeak
  ? 'material-symbols:sound-detection-loud-sound-outline'
  : 'material-symbols:sound-detection-loud-sound')

const handleUpdate = () => {
  ttsStore.updateStore({ autoSpeak: !ttsStore.autoSpeak })
  if (ttsStore.autoSpeak) {
    message.success('开启自动播放')
  }
  else {
    message.warning('关闭自动播放')
    cancelSpeak()
  }
}
</script>

<script lang="ts">
export default {
  name: 'AutoSpeak',
}
</script>

<template>
  <HoverButton>
    <span class="text-xl text-[#4f555e] dark:text-white" :class="ttsStore.autoSpeak ? 'text-pink-700' : 'dark:text-white'">
      <SvgIcon :icon="voiceIcon" @click="handleUpdate" />
    </span>
  </HoverButton>
</template>

<style scoped>

</style>
