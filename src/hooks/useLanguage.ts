import { computed } from 'vue'
import { enUS, zhCN } from 'naive-ui'
import { useAppStore } from '@/store'
import { setLocale } from '@/locales'

export function useLanguage() {
  const appStore = useAppStore()

  const language = computed(() => {
    switch (appStore.language) {
      case 'en-US':
        setLocale('en-US')
        return enUS
      case 'zh-CN':
        setLocale('zh-CN')
        return zhCN
      default:
        setLocale('zh-CN')
        return enUS
    }
  })

  return { language }
}
