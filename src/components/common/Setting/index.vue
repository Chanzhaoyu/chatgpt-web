<script setup lang='ts'>
import { computed, ref, watch } from 'vue'
import { NCard, NModal } from 'naive-ui'
import { fetchChatConfig } from '@/api'

interface Props {
  visible: boolean
}

interface Emit {
  (e: 'update:visible', visible: boolean): void
}

interface ConfigState {
  timeoutMs?: number
  reverseProxy?: string
  apiModel?: string
  socksProxy?: string
}

const props = defineProps<Props>()

const emit = defineEmits<Emit>()

const show = computed({
  get() {
    return props.visible
  },
  set(visible: boolean) {
    emit('update:visible', visible)
  },
})

const config = ref<ConfigState>()

async function fetchConfig() {
  try {
    const { data } = await fetchChatConfig<ConfigState>()
    config.value = data
  }
  catch (error) {
    // ...
  }
}

watch(
  () => props.visible,
  (val) => {
    if (val)
      fetchConfig()
  },
)
</script>

<template>
  <NModal v-model:show="show" style="width: 80%; max-width: 460px;">
    <NCard>
      <div class="space-y-4">
        <h2 class="text-xl font-bold text-center">
          ChatGPT - web
        </h2>
        <hr>
        <p>
          此项目为个人项目，仅限学习！如果你觉得此项目对你有所帮助，请关注下方公众号，谢谢！
        </p>
        <hr>
        <img src="@/assets/qrcode.jpg" class="icon" alt="avatar">
      </div>
    </NCard>
  </NModal>
</template>

<style>
.icon {
  width: 125px;
}
</style>
