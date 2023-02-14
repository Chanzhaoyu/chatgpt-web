<script setup lang='ts'>
import { HoverButton, SvgIcon, UserAvatar } from '@/components/common'
</script>

<template>
  <footer class="flex items-center justify-between min-w-0 p-4 overflow-hidden border-t h-[70px]">
    <UserAvatar class="flex-1" />
    <HoverButton tooltip="Setting">
      <span class="text-xl text-[#4f555e]">
        <SvgIcon icon="ri:settings-4-line" />
      </span>
    </HoverButton>
  </footer>
</template>
