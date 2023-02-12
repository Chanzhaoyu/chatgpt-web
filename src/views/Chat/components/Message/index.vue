<script setup lang='ts'>
import Avatar from './Avatar.vue'
import Text from './Text.vue'

interface Props {
  message?: string
  dateTime?: string
  reversal?: boolean
}

defineProps<Props>()
</script>

<template>
  <div class="flex w-full mb-6" :class="[{ 'flex-row-reverse': reversal }]">
    <div
      class="flex items-center justify-center rounded-full overflow-hidden w-[32px] h-[32px]"
      :class="[reversal ? 'ml-3' : 'mr-3']"
    >
      <Avatar :image="reversal" />
    </div>
    <div class="flex flex-col flex-1 text-sm" :class="[reversal ? 'items-end' : 'items-start']">
      <span class="text-xs text-[#b4bbc4]">
        {{ dateTime }}
      </span>
      <div class="p-2 mt-2 rounded-md" :class="[reversal ? 'bg-[#d2f9d1]' : 'bg-[#f4f6f8]']">
        <Text>{{ message }}</Text>
      </div>
    </div>
  </div>
</template>
