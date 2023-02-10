import dotenv from 'dotenv'
import { ChatGPTAPI } from 'chatgpt'

dotenv.config()

const apiKey = ''

/**
 * More Info: https://github.com/transitive-bullshit/chatgpt-api
 */
const api = new ChatGPTAPI({ apiKey: process.env.OPENAI_API_KEY || apiKey })

async function chatReply(message: string) {
  if (!message)
    return
  return await api.sendMessage(message)
}

export { chatReply }
