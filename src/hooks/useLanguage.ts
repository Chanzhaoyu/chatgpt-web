import { computed } from 'vue'
import { enUS, espES, koKR, zhCN, zhTW } from 'naive-ui'
import { useAppStore } from '@/store'
import { setLocale } from '@/locales'

export function useLanguage() {
  const appStore = useAppStore()

  const language = computed(() => {
    switch (appStore.language) {
      case 'en-US':
        setLocale('en-US')
        return enUS
      case 'esp-ES':
        setLocale('esp-ES')
        return espES
			case 'ru-RU':
        setLocale('ru-RU')
        return enUS
      case 'ko-KR':
        setLocale('ko-KR')
        return koKR
      case 'zh-CN':
        setLocale('zh-CN')
        return zhCN
      case 'zh-TW':
        setLocale('zh-TW')
        return zhTW
      default:
        setLocale('en-US'')
        return enUS
    }
  })

  return { language }
}
