import { computed } from 'vue'
import { enUS, esAR, koKR, ruRU, viVN, zhCN, zhTW } from 'naive-ui'
import { useAppStore } from '@/store'
import { setLocale } from '@/locales'

export function useLanguage() {
  const appStore = useAppStore()

  const language = computed(() => {
    setLocale(appStore.language)
    switch (appStore.language) {
      case 'en-US':
        return enUS
      case 'es-ES':
        return esAR
      case 'ko-KR':
        return koKR
      case 'vi-VN':
        return viVN
      case 'ru-RU':
        return ruRU
      case 'zh-CN':
        return zhCN
      case 'zh-TW':
        return zhTW
      default:
        return enUS
    }
  })

  return { language }
}
