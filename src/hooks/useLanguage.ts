import { computed } from 'vue'
import { enUS, zhCN, zhTW, deDE, frFR, ruRU, jaJP } from 'naive-ui'
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
      case 'de-DE':
        setLocale('de-DE')
        return deDE
      case 'fr-FR':
        setLocale('fr-FR')
        return frFR
      case 'ru-RU':
        setLocale('ru-RU')
        return ruRU
      case 'ja-JP':
        setLocale('ja-JP')
        return jaJP
      default:
        setLocale('zh-CN')
        return enUS
    }
  })

  return { language }
}
