import express from 'express'
import type { ChatContext } from './chatgpt'
import { chatReplayOne, chatReply, clearChatContext } from './chatgpt'

const app = express()

app.use(express.json())

app.all('*', (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'Content-Type')
  res.header('Access-Control-Allow-Methods', '*')
  next()
})

app.listen(3002, () => globalThis.console.log('Server is running on port 3002'))

app.post('/chat', async (req, res) => {
  try {
    const { prompt } = req.body as { prompt: string }
    const response = await chatReply(prompt)
    res.send(response)
  }
  catch (error) {
    res.send(error)
  }
})

app.post('./chatOne', async (req, res) => {
  try {
    const { prompt, options = {} } = req.body as { prompt: string; options?: ChatContext }
    const response = await chatReplayOne(prompt, options)
    res.send(response)
  }
  catch (error) {
    res.send(error)
  }
})

app.post('/clear', async (req, res) => {
  const response = await clearChatContext()
  res.send(response)
})
