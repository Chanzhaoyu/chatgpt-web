<script setup lang="ts">
import { computed, watch } from 'vue'
import { NConfigProvider, darkTheme } from 'naive-ui'
import { NaiveProvider } from '@/components/common'
import { useAppStore } from '@/store'

const appStore = useAppStore()

watch(
  () => appStore.theme,
  (theme) => {
    if (theme === 'dark')
      document.documentElement.classList.add('dark')
    else
      document.documentElement.classList.remove('dark')
  },
  { immediate: true },
)

const theme = computed(() => {
  return appStore.theme === 'dark' ? darkTheme : undefined
})
</script>

<template>
  <NConfigProvider class="h-full" :theme="theme">
    <NaiveProvider>
      <RouterView />
    </NaiveProvider>
  </NConfigProvider>
</template>
