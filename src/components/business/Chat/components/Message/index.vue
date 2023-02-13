<script setup lang='ts'>
import Avatar from './Avatar.vue'
import Text from './Text.vue'

interface Props {
  message?: string
  dateTime?: string
  reversal?: boolean
  error?: boolean
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
      <Text :reversal="reversal" :error="error">
        {{ message }}
      </Text>
    </div>
  </div>
</template>
