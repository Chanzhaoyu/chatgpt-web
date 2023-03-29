import express from 'express'
import * as tencentcloud from 'tencentcloud-sdk-nodejs'
import type { RequestProps } from './types'
import type { ChatMessage } from './chatgpt'
import { chatConfig, chatReplyProcess, currentModel } from './chatgpt'
import { auth } from './middleware/auth'
import { limiter } from './middleware/limiter'
import { isNotEmptyString } from './utils/is'

const CvmClient = tencentcloud.cvm.v20170312.Client
const app = express()
const router = express.Router()

app.use(express.static('public'))
app.use(express.json())

app.all('*', (_, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'authorization, Content-Type')
  res.header('Access-Control-Allow-Methods', '*')
  next()
})

// import TencentCloud SDK for NLP
const tencentcloud = require('tencentcloud-sdk-nodejs-nlp')
const NlpClient = tencentcloud.nlp.v20190408.Client
const clientConfig = {
  credential: {
    secretId: 'YOUR_SECRET_ID',
    secretKey: 'YOUR_SECRET_KEY',
  },
  region: 'ap-guangzhou',
  profile: {
    httpProfile: {
      endpoint: 'nlp.tencentcloudapi.com',
    },
  },
}
const client = new NlpClient(clientConfig)
const { google } = require('googleapis')

// Instantiate a Tencent Cloud NLP client
const nlpClient = new tencentcloud.nlp.v20190408.Client({
  credential: {
    secretId: 'YOUR_SECRET_ID',
    secretKey: 'YOUR_SECRET_KEY',
  },
  region: 'ap-guangzhou',
  profile: {
    httpProfile: {
      endpoint: 'nlp.tencentcloudapi.com',
    },
  },
})

// Function to search Google with provided query
async function searchGoogle(query) {
  const customsearch = google.customsearch('v1')
  const res = await customsearch.cse.list({
    cx: 'YOUR_CSE_ID', // Your Custom Search Engine ID
    q: query,
    auth: 'YOUR_API_KEY', // Your API Key
  })
  const searchResults = res.data.items.map(({ title, link }) => ({ title, link }))
  return searchResults
}

router.post('/chat-process', [auth, limiter], async (req, res) => {
  res.setHeader('Content-type', 'application/octet-stream')

  try {
    let { prompt, options = {}, systemMessage } = req.body as RequestProps

    // Extract keywords with Tencent Cloud NLP API
    const keywordMatch = prompt.match(/^(.*?)\b(.*?)(怎么样|\?)$/i)
    if (keywordMatch && keywordMatch[2]) {
      const keyword = keywordMatch[2].trim()
      const params = {
        Text: keyword,
        Num: 1, // extract only one keyword
      }
      const response = await nlpClient.KeywordsExtraction(params)

      if (response?.Keywords?.length > 0) {
        const searchResult = response.Keywords[0].Word

        // Search Google with extracted keywords
        const searchPrompt = `${keyword} ${searchResult}`
        const searchResults = await searchGoogle(searchPrompt)
        const searchResultTitles = searchResults.map(result => result.title).join(', ')

        prompt += `（根据搜索：${searchResultTitles}）`
      }
    }
    let firstChunk = true
    let chatLength = 0
    let newChatLength = 0
    await chatReplyProcess({
      message: prompt,
      lastContext: options,
      process: (chat: ChatMessage) => {
        if (firstChunk) {
          res.write(`${JSON.stringify(chat)}t1h1i4s5i1s4a1s9i1l9l8y1s0plit`)
          firstChunk = false
        }
        else if (chatLength !== chat.text.length) {
          newChatLength = chat.text.length
          res.write(chat.text.substring(chatLength, newChatLength))
          chatLength = newChatLength
        }
      },
      systemMessage,
    })
  }
  catch (error) {
    console.error(error)
    let errorMessage = 'Server Error'
    if (error?.code === 'InvalidParameterValue')
      errorMessage = '请求参数错误 | Invalid request parameter'

    else if (error?.message)
      errorMessage = error.message

    res.status(500).send({ status: 'Fail', message: errorMessage, data: null })
  }
  finally {
    res.end()
  }
})

router.post('/config', auth, async (req, res) => {
  try {
    const response = await chatConfig()
    res.send(response)
  }
  catch (error) {
    console.error(error)
    res.status(500).send({ status: 'Fail', message: error.message, data: null })
  }
})

router.post('/session', async (req, res) => {
  try {
    const AUTH_SECRET_KEY = process.env.AUTH_SECRET_KEY
    const hasAuth = isNotEmptyString(AUTH_SECRET_KEY)
    res.send({ status: 'Success', message: '', data: { auth: hasAuth, model: currentModel() } })
  }
  catch (error) {
    console.error(error)
    res.status(500).send({ status: 'Fail', message: error.message, data: null })
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
app.set('trust proxy', 1)

app.listen(3002, () => globalThis.console.log('Server is running on port 3002'))
