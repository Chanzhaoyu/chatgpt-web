import { computed } from 'vue'
import { enUS, koKR, zhCN, zhTW } from 'naive-ui'
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
      case 'zh-TW':
        setLocale('zh-TW')
        return zhTW
      case 'ko-KR':
        setLocale('ko-KR')
        return koKR
      default:
        setLocale('zh-CN')
        return zhCN
    }
  })

  return { language }
}
