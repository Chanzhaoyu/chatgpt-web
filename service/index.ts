import dotenv from 'dotenv'
import { ChatGPTAPI } from 'chatgpt'
import express from 'express'

dotenv.config()

const app = express()

app.use(express.json())

async function chatAPI(message: string) {
  if (!message)
    throw new Error('Message is not defined')

  if (!process.env.OPENAI_API_KEY)
    throw new Error('OPENAI_API_KEY is not defined in .env file')

  try {
    const api = new ChatGPTAPI({ apiKey: process.env.OPENAI_API_KEY })
    const res = await api.sendMessage(message)
    return res
  }
  catch (error) {
    return error
  }
}

app.all('*', (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'Content-Type')
  res.header('Access-Control-Allow-Methods', '*')
  next()
})

app.listen(3002, () => globalThis.console.log('Server is running on port 3002'))

app.post('/chat', async (req, res) => {
  const { message } = req.body
  const response = await chatAPI(message)
  res.send(response)
})
