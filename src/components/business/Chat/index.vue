<script setup lang='ts'>
import { nextTick, onMounted, ref } from 'vue'
import { NButton, NInput, useMessage } from 'naive-ui'
import { Message } from './components'
import { Layout } from './layout'
import { clearConversations, fetchChatAPI } from '@/api'
import { HoverButton, SvgIcon } from '@/components/common'

interface ListProps {
  dateTime: string
  message: string
  reversal?: boolean
  error?: boolean
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
    await clearConversations()
  }
  catch (error) {
    ms.error('Clear failed, please try again later.')
  }
  finally {
    list.value = []
    setTimeout(initChat, 100)
  }
}

function handleEnter(event: KeyboardEvent) {
  if (event.key === 'Enter')
    handleSubmit()
}

async function handleSubmit() {
  if (loading.value)
    return

  const message = prompt.value.trim()

  if (!message || !message.length) {
    ms.warning('Please enter a message')
    return
  }

  addMessage(message, true)
  prompt.value = ''

  try {
    loading.value = true
    const { data } = await fetchChatAPI(message)
    addMessage(data?.text ?? '', false)
  }
  catch (error: any) {
    addMessage(`Error: ${error.message ?? 'Request failed, please try again later.'}`, false, true)
  }
  finally {
    loading.value = false
  }
}

function addMessage(message: string, reversal = false, error = false) {
  list.value.push({ dateTime: new Date().toLocaleString(), message, reversal, error })
  nextTick(() => scrollRef.value && (scrollRef.value.scrollTop = scrollRef.value.scrollHeight))
}
</script>

<template>
  <Layout>
    <div class="flex flex-col h-full">
      <main class="flex-1 overflow-hidden">
        <div ref="scrollRef" class="h-full p-4 overflow-hidden overflow-y-auto">
          <div>
            <Message
              v-for="(item, index) of list"
              :key="index"
              :date-time="item.dateTime"
              :message="item.message"
              :reversal="item.reversal"
              :error="item.error"
            />
          </div>
        </div>
      </main>
      <footer class="p-4">
        <div class="flex items-center justify-between space-x-2">
          <HoverButton tooltip="Clear conversations" @click="handleClear">
            <span class="text-xl text-[#4f555e]">
              <SvgIcon icon="ri:delete-bin-line" />
            </span>
          </HoverButton>
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
