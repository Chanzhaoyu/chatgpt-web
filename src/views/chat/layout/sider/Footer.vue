<script setup lang='ts'>
import { ref } from 'vue'
import { HoverButton, Setting, SvgIcon, UserAvatar } from '@/components/common'

const show = ref(false)
</script>

<template>
  <footer class="flex items-center justify-between min-w-0 p-4 overflow-hidden border-t">
    <UserAvatar />
    <HoverButton tooltip="Setting" @click="show = true">
      <span class="text-xl text-[#4f555e]">
        <SvgIcon icon="ri:settings-4-line" />
      </span>
    </HoverButton>

    <Setting v-model:visible="show" />
  </footer>
</template>
