<script setup lang='ts'>
import { computed, ref } from 'vue'
import { NDropdown } from 'naive-ui'
import { HoverButton, Setting, SvgIcon, UserAvatar } from '@/components/common'
import { useAppStore } from '@/store'
import { useIconRender } from '@/hooks/useIconRender'

const appStore = useAppStore()

const { iconRender } = useIconRender()

const show = ref(false)

const theme = computed(() => appStore.theme)

const options = [
  {
    label: 'Dark',
    key: 'dark',
    icon: iconRender({ icon: 'ri:moon-foggy-line' }),
  },
  {
    label: 'Light',
    key: 'light',
    icon: iconRender({ icon: 'ri:sun-foggy-line' }),
  },
  {
    label: 'Auto',
    key: 'auto',
    icon: iconRender({ icon: 'ri:contrast-line' }),
  },
]

function handleThemeChange(key: 'light' | 'dark' | 'auto') {
  appStore.setTheme(key)
}
</script>

<template>
  <footer class="flex items-center justify-between min-w-0 p-4 overflow-hidden border-t dark:border-neutral-800">
    <UserAvatar />

    <NDropdown :options="options" placement="top" trigger="click" @select="handleThemeChange">
      <HoverButton>
        <span class="text-xl text-[#4f555e] dark:text-white">
          <SvgIcon v-if="theme === 'dark'" icon="ri:moon-foggy-line" />
          <SvgIcon v-if="theme === 'light'" icon="ri:sun-foggy-line" />
          <SvgIcon v-if="theme === 'auto'" icon="ri:contrast-line" />
        </span>
      </HoverButton>
    </NDropdown>

    <HoverButton tooltip="Setting" @click="show = true">
      <span class="text-xl text-[#4f555e] dark:text-white">
        <SvgIcon icon="ri:settings-4-line" />
      </span>
    </HoverButton>

    <Setting v-model:visible="show" />
  </footer>
</template>
