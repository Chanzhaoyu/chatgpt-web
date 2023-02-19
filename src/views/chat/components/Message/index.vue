<script setup lang='ts'>
import Avatar from './Avatar.vue'
import Text from './Text.vue'

interface Props {
  dateTime?: string
  text?: string
  inversion?: boolean
  error?: boolean
}

defineProps<Props>()
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
      <Text :inversion="inversion" :error="error">
        {{ text }}
      </Text>
    </div>
  </div>
</template>
