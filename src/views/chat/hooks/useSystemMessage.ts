import { useMessage } from 'naive-ui'
import { useSysMsgStore } from '@/store'

const minMessageLength = 15
const systemMessageSetUpPrefix = '%system%'
const systemMessageQueryPrefix = '%current%'

export function useSystemMessage() {
  const ms = useMessage()
  const sysMsgStore = useSysMsgStore()

  function setSystemMessage(uuid: number, message: string) {
    message = message.substring(systemMessageSetUpPrefix.length).trim()
    try {
      if (message.length > 1) {
        if (message.length > minMessageLength) {
          sysMsgStore.setCurrentSystemMessage(uuid, message)
          ms.success(`New system message has been set to: ${message}`)
        }
        else {
          ms.error(`The system message should be at least ${minMessageLength} characters.`)
        }
      }
      else {
        sysMsgStore.restoreDefaultSystemMessage(uuid)
        ms.success('Reset system message to default.')
      }
    }
    catch (error) {
      ms.error(`Eror occurred when setting system message: ${JSON.stringify(error)}`)
    }
  }

  function getSystemMessage(uuid: number): string {
    return sysMsgStore.currentSystemMessage(uuid)
  }

  return {
    systemMessageSetUpPrefix,
    systemMessageQueryPrefix,
    setSystemMessage,
    getSystemMessage,
  }
}
