import { computed } from 'vue'
import { enUS, esES, ruRU, koKR, zhCN, zhTW } from 'naive-ui'
import { useAppStore } from '@/store'
import { setLocale } from '@/locales'

export function useLanguage() {
  const appStore = useAppStore()

  const language = computed(() => {
    switch (appStore.language) {
      case 'en-US':
        setLocale('en-US')
        return enUS
      case 'es-ES':
        setLocale('es-ES')
        return esES
			case 'ru-RU':
        setLocale('ru-RU')
        return ruRU
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
        setLocale('en-US')
        return enUS
    }
  })

  return { language }
}
