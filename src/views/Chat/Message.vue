<script setup lang='ts'>
import { SvgIcon } from '@/components'

interface Props {
  user?: boolean
  date?: string
  message?: string
  error?: boolean
}

defineProps<Props>()
</script>

<template>
  <div class="flex w-full mb-6" :class="[{ 'flex-row-reverse': user }]">
    <div
      class="flex items-center justify-center rounded-full overflow-hidden w-[32px] h-[32px]"
      :class="[user ? 'ml-3' : 'mr-3']"
    >
      <img v-if="user" src="@/assets/avatar.jpg" class="object-cover w-full h-full " alt="avatar">
      <SvgIcon v-else local-icon="logo" class="text-[26px]" />
    </div>
    <div class="flex flex-col flex-1 text-sm" :class="[{ 'items-end': user }]">
      <span class="text-xs text-[#b4bbc4]">
        {{ date }}
      </span>
      <div class="p-2 mt-2 rounded-md" :class="[user ? 'bg-[#d2f9d1]' : 'bg-[#f4f6f8]']">
        <span class="leading-relaxed" :class="[{ 'text-red-500': error }]" v-html="message" />
      </div>
    </div>
  </div>
</template>
