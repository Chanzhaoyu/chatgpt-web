import { ss } from '@/utils/storage'

const LOCAL_NAME = 'systemMessage'

// system message config
const currentDate = (new Date()).toISOString().split('T')[0]

const originalSystemMessage = `You are ChatGPT, a large language model trained by OpenAI. Answer as concisely as possible.
Knowledge cutoff: 2021-09-01
Current date: ${currentDate}`
export const defaultSystemMessage = import.meta.env.VITE_DEFAULT_SYSTEM_MESSAGE || originalSystemMessage

export interface SystemMessage {
  default: string
  current: string
}

export function defaultSysMsg(): SystemMessage {
  return { default: defaultSystemMessage, current: '' }
}

export function getSysMsg(): SystemMessage {
  const systemMessage: SystemMessage | undefined = ss.get(LOCAL_NAME)
  return { ...defaultSysMsg(), ...systemMessage }
}

export function setSysMsg(sysMsg: SystemMessage): void {
  ss.set(LOCAL_NAME, sysMsg)
}
