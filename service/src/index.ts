import express from 'express'
import doreamon from '@zodash/doreamon'
import type { ChatContext, ChatMessage } from './chatgpt'
import { chatConfig, chatReplyProcess } from './chatgpt'
import { auth } from './middleware/auth'

const app = express()
const router = express.Router()

app.use(express.static('public'))
app.use(express.json())

app.all('*', (_, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'Content-Type')
  res.header('Access-Control-Allow-Methods', '*')
  next()
})

router.post('/chat-process', auth, async (req, res) => {
  res.setHeader('Content-type', 'application/octet-stream')

  const {
    prompt,
    options = {},
    user,
  } = req.body as {
    prompt: string
    options?: ChatContext
    user?: {
      nickname: string
    }
  }

  try {
    let firstChunk = true
    doreamon.logger.info(`${user?.nickname} ask ChatGPT: ${prompt}`)

    await chatReplyProcess(prompt, options, (chat: ChatMessage) => {
      // doreamon.logger.info(`ChatGPT answer ${user?.nickname}: ${prompt}`);
      res.write(firstChunk ? JSON.stringify(chat) : `\n${JSON.stringify(chat)}`)
      firstChunk = false
    })

    doreamon.logger.info(`ChatGPT answer ${user?.nickname}: success for prompt => ${prompt}`)
  }
  catch (error) {
    doreamon.logger.error(`ChatGPT answer ${user?.nickname}: error for prompt => ${prompt}, error detail:`, error)
    // @TODO context_length_exceeded
    if (error.message.includes('context_length_exceeded')) {
      res.write('对话内容长度异常，请勿提问过快，通过 New Chat 创建新对话即可解决问题')
    }
    else {
      // unknown error
      res.write(JSON.stringify(error))
    }
  }
  finally {
    res.end()
  }
})

router.post('/config', async (req, res) => {
  try {
    const response = await chatConfig()
    res.send(response)
  }
  catch (error) {
    res.send(error)
  }
})

router.post('/session', async (req, res) => {
  try {
    const AUTH_SECRET_KEY = process.env.AUTH_SECRET_KEY
    const hasAuth = typeof AUTH_SECRET_KEY === 'string' && AUTH_SECRET_KEY.length > 0
    res.send({ status: 'Success', message: '', data: { auth: hasAuth } })
  }
  catch (error) {
    res.send({ status: 'Fail', message: error.message, data: null })
  }
})

router.post('/verify', async (req, res) => {
  try {
    const { token } = req.body as { token: string }
    if (!token)
      throw new Error('Secret key is empty')

    if (process.env.AUTH_SECRET_KEY !== token)
      throw new Error('密钥无效 | Secret key is invalid')

    res.send({ status: 'Success', message: 'Verify successfully', data: null })
  }
  catch (error) {
    res.send({ status: 'Fail', message: error.message, data: null })
  }
})

app.use('', router)
app.use('/api', router)

app.listen(3002, () => globalThis.console.log('Server is running on port 3002'))
