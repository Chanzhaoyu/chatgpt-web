import { ref } from 'vue'
import { useMessage } from 'naive-ui'
import { t } from '@/locales'

export function useUsingContext() {
  const ms = useMessage()
  const usingContext = ref<boolean>(true)

  function toggleUsingContext() {
    usingContext.value = !usingContext.value
    if (usingContext.value)
      ms.success(t('chat.turnOnContext'))
    else
      ms.warning(t('chat.turnOffContext'))
  }

  return {
    usingContext,
    toggleUsingContext,
  }
}
