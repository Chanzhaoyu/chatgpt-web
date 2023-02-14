<script setup lang='ts'>
import { computed, nextTick, onMounted, ref } from 'vue'
import { NButton, NInput, useMessage } from 'naive-ui'
import type { ChatOptions, ChatProps } from './types'
import { Message } from './components'
import { Layout } from './layout'
import { fetchChatAPI } from '@/api'
import { HoverButton, SvgIcon } from '@/components/common'

const scrollRef = ref<HTMLDivElement>()

const ms = useMessage()

const prompt = ref('')
const loading = ref(false)

const list = ref<ChatProps[]>([])
const chatList = computed(() => list.value.filter(item => (!item.reversal && !item.error)))

function initChat() {
  addMessage('Hi, I am ChatGPT, a chatbot based on GPT-3.')
}

onMounted(initChat)

async function handleSubmit() {
  if (loading.value)
    return

  const message = prompt.value.trim()

  if (!message || !message.length) {
    ms.warning('Please enter a message')
    return
  }

  addMessage(message, { reversal: true })
  prompt.value = ''

  let options: ChatOptions = {}
  const lastContext = chatList.value[chatList.value.length - 1]?.options

  if (lastContext)
    options = { ...lastContext }

  try {
    loading.value = true
    const { data } = await fetchChatAPI(message, options)
    addMessage(data?.text ?? '', { options: { conversationId: data.conversationId, parentMessageId: data.id } })
  }
  catch (error: any) {
    addMessage(`Error: ${error.message ?? 'Request failed, please try again later.'}`, { error: true })
  }
  finally {
    loading.value = false
  }
}

function handleEnter(event: KeyboardEvent) {
  if (event.key === 'Enter')
    handleSubmit()
}

function addMessage(
  message: string,
  args?: { reversal?: boolean; error?: boolean; options?: ChatOptions },
) {
  list.value.push({
    dateTime: new Date().toLocaleString(),
    message,
    reversal: args?.reversal ?? false,
    error: args?.error ?? false,
    options: args?.options ?? undefined,
  })
  nextTick(() => scrollRef.value && (scrollRef.value.scrollTop = scrollRef.value.scrollHeight))
}

function handleClear() {
  list.value = []
  setTimeout(initChat, 100)
}
</script>

<template>
  <Layout>
    <div class="flex flex-col h-full">
      <main class="flex-1 overflow-hidden">
        <div ref="scrollRef" class="h-full p-4 overflow-hidden overflow-y-auto">
          <div>
            <Message
              v-for="(item, index) of list" :key="index" :date-time="item.dateTime" :message="item.message"
              :reversal="item.reversal" :error="item.error"
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
