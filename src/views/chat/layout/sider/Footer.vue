<script setup lang='ts'>
import { computed, ref } from 'vue'
import { HoverButton, Setting, SvgIcon, UserAvatar } from '@/components/common'
import { useAppStore } from '@/store'

const appStore = useAppStore()

const show = ref(false)

const isDark = computed(() => appStore.theme === 'dark')

function handleThemeChange() {
  appStore.setTheme(isDark.value ? 'light' : 'dark')
}
</script>

<template>
  <footer class="flex items-center justify-between min-w-0 p-4 overflow-hidden border-t dark:border-neutral-800">
    <UserAvatar />

    <HoverButton tooltip="Theme" @click="handleThemeChange">
      <span class="text-xl text-[#4f555e] dark:text-white">
        <SvgIcon v-if="isDark" icon="ri:sun-foggy-line" />
        <SvgIcon v-else icon="ri:moon-foggy-line" />
      </span>
    </HoverButton>

    <HoverButton tooltip="Setting" @click="show = true">
      <span class="text-xl text-[#4f555e] dark:text-white">
        <SvgIcon icon="ri:settings-4-line" />
      </span>
    </HoverButton>

    <Setting v-model:visible="show" />
  </footer>
</template>
