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
        <h1 class="text-xl font-bold">
          当前后台设置
        </h1>
        <p>API方式：{{ config?.apiModel ?? '-' }}</p>
        <p>反向代理：{{ config?.reverseProxy ?? '-' }}</p>
        <p>超时时间：{{ config?.timeoutMs ?? '-' }}</p>
      </div>
    </NCard>
  </NModal>
</template>
