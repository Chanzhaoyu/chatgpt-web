import { computed } from 'vue'
import { enUS, zhCN } from 'naive-ui'
import { useAppStore } from '@/store'

export function useLanguage() {
  const appStore = useAppStore()

  const language = computed(() => {
    if (appStore.language === 'zh-CN')
      return zhCN
    else
      return enUS
  })

  return { language }
}
