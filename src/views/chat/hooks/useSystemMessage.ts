import { useMessage } from 'naive-ui'
import { useSysMsgStore } from '@/store'

const systemMessageSetUpPrefix = '%system%'
const systemMessageQueryPrefix = '%current%'

export function useSystemMessage() {
  const ms = useMessage()
  const sysMsgStore = useSysMsgStore()

  function setSystemMessage(message: string) {
    message = message.substring(systemMessageSetUpPrefix.length).trim()
    try {
      if (message.length > 1) {
        sysMsgStore.setCurrentSystemMessage(message)
        ms.success(`New System Message Set to: ${message}`)
      }
      else {
        sysMsgStore.restoreDefaultSystemMessage()
        ms.success('Reset system message to default.')
      }
    }
    catch (error) {
      ms.error(`Eror occurred when setting system message: ${JSON.stringify(error)}`)
    }
  }

  function getSystemMessage(): string {
    return sysMsgStore.currentSystemMessage
  }

  return {
    systemMessageSetUpPrefix,
    systemMessageQueryPrefix,
    setSystemMessage,
    getSystemMessage,
  }
}
