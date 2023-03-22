import express from 'express'
import type {ChatContext, ChatMessage} from './chatgpt'
import {chatConfig, chatReply, chatReplyProcess} from './chatgpt'

import {ChatGPTAPI} from 'chatgpt'


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

router.post('/chat', async (req, res) => {
	try {
		const {prompt, options = {}} = req.body as { prompt: string; options?: ChatContext }
		const response = await chatReply(prompt, options)
		res.send(response)
	} catch (error) {
		res.send(error)
	}
})

router.post('/chat-process', async (req, res) => {
	res.setHeader('Content-type', 'application/octet-stream')

	try {
		const {prompt, options = {}} = req.body as { prompt: string; options?: ChatContext }
		let firstChunk = true
		await chatReplyProcess(prompt, options, (chat: ChatMessage) => {
			res.write(firstChunk ? JSON.stringify(chat) : `\n${JSON.stringify(chat)}`)
			firstChunk = false
		})
	} catch (error) {
		res.write(JSON.stringify(error))
	} finally {
		res.end()
	}
})

router.post('/config', async (req, res) => {
	try {
		const response = await chatConfig()
		res.send(response)
	} catch (error) {
		res.send(error)
	}
})
router.post('/test', async (req, res) => {
	try {
		console.log(req.body)

		async function test() {
			const api = new ChatGPTAPI({
				apiKey: process.env.OPENAI_API_KEY,
			})
			return await api.sendMessage('Hello World!', {timeoutMs: 20000})
		}

		const response = await test()
		res.send(response)
	} catch (error) {
		res.send(error)
	}
})

app.use('', router)
app.use('/api', router)

app.listen(3002, () => globalThis.console.log('http://localhost:3002/api/'))
