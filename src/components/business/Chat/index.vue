<script setup lang='ts'>
import { nextTick, onMounted, ref } from 'vue'
import { NButton, NInput, useMessage } from 'naive-ui'
import { Message } from './components'
import { clearChatContext, fetchChatAPI } from './request'
import { Layout } from './layout'
import { HoverButton, SvgIcon } from '@/components/common'

interface ListProps {
  dateTime: string
  message: string
  reversal?: boolean
}

const scrollRef = ref<HTMLDivElement>()

const ms = useMessage()

const prompt = ref('')

const loading = ref(false)

const list = ref<ListProps[]>([])

onMounted(initChat)

function initChat() {
  addMessage('Hi, I am ChatGPT, a chatbot based on GPT-3.', false)
}

async function handleClear() {
  try {
    const { message } = await clearChatContext()
    ms.success(message)
    list.value = []
    setTimeout(initChat, 100)
  }
  catch (error) {
    ms.error('Clear failed, please try again later.')
  }
}

function handleEnter(event: KeyboardEvent) {
  if (event.key === 'Enter')
    handleSubmit()
}

async function handleSubmit() {
  const message = prompt.value.trim()

  if (!message || !message.length) {
    ms.warning('Please enter a message')
    return
  }

  addMessage(message, true)
  prompt.value = ''

  try {
    loading.value = true
    const { text } = await fetchChatAPI(message)
    addMessage(text, false)
  }
  catch (error: any) {
    addMessage(error.message ?? 'Request failed, please try again later.', false)
  }
  finally {
    loading.value = false
  }
}

function addMessage(message: string, reversal = false) {
  list.value.push({ dateTime: new Date().toLocaleString(), message, reversal })
  nextTick(() => scrollRef.value && (scrollRef.value.scrollTop = scrollRef.value.scrollHeight))
}
</script>

<template>
  <Layout>
    <div class="flex flex-col h-full">
      <header class="flex items-center justify-between p-4">
        <h1 class="text-xl font-bold">
          ChatGPT Web
        </h1>
        <div class="flex items-center space-x-4">
          <HoverButton tooltip="Clear" @click="handleClear">
            <SvgIcon icon="ri:delete-bin-6-line" />
          </HoverButton>
        </div>
      </header>
      <main class="flex-1 overflow-hidden border-y">
        <div ref="scrollRef" class="h-full p-4 overflow-hidden overflow-y-auto">
          <div>
            <Message
              v-for="(item, index) of list" :key="index" :date-time="item.dateTime" :message="item.message"
              :reversal="item.reversal"
            />
          </div>
        </div>
      </main>
      <footer class="p-4">
        <div class="flex items-center justify-between space-x-2">
          <NInput v-model:value="prompt" placeholder="Type a message..." @keypress="handleEnter" />
          <NButton type="primary" :loading="loading" @click="handleSubmit">
            <template #icon>
              <SvgIcon icon="ri:send-plane-fill" />
            </template>
          </NButton>
        </div>
      </footer>
    </div>
  </Layout>
</template>
