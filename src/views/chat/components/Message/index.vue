<script setup lang='ts'>
import Avatar from './Avatar.vue'
import Text from './Text.vue'
import { SvgIcon } from '@/components/common'

interface Props {
  dateTime?: string
  text?: string
  inversion?: boolean
  error?: boolean
  loading?: boolean
}

interface Emit {
  (ev: 'regenerate'): void
}

defineProps<Props>()

const emit = defineEmits<Emit>()

function handleRegenerate() {
  emit('regenerate')
}
</script>

<template>
  <div class="flex w-full mb-6" :class="[{ 'flex-row-reverse': inversion }]">
    <div
      class="flex items-center justify-center rounded-full overflow-hidden w-[32px] h-[32px]"
      :class="[inversion ? 'ml-3' : 'mr-3']"
    >
      <Avatar :image="inversion" />
    </div>
    <div class="flex flex-col flex-1 text-sm" :class="[inversion ? 'items-end' : 'items-start']">
      <span class="text-xs text-[#b4bbc4]">
        {{ dateTime }}
      </span>
      <div class="flex items-end mt-2">
        <Text :inversion="inversion" :error="error" :text="text" :loading="loading" />
        <button
          v-if="!inversion && !loading"
          class="mb-2 ml-2 transition text-neutral-400 hover:text-neutral-800"
          @click="handleRegenerate"
        >
          <SvgIcon icon="ri:restart-line" />
        </button>
      </div>
    </div>
  </div>
</template>
