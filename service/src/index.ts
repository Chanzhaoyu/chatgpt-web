import express from 'express'
import type { ChatContext } from './chatgpt'
import { chatReply } from './chatgpt'

const app = express()

app.use(express.json())

app.all('*', (_, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'Content-Type')
  res.header('Access-Control-Allow-Methods', '*')
  next()
})

app.post('/chat', async (req, res) => {
  try {
    const { prompt, options = {} } = req.body as { prompt: string; options?: ChatContext }
    const response = await chatReply(prompt, options)
    res.send(response)
  }
  catch (error) {
    res.send(error)
  }
})

app.listen(3002, () => globalThis.console.log('Server is running on port 3002'))
