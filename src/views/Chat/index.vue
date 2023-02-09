<script setup lang='ts'>
import { onMounted, ref } from 'vue'
import { NButton, NInput, useMessage } from 'naive-ui'
import Message from './Message.vue'
import { fetchChatAPI } from './request'
import { SvgIcon } from '@/components'

interface ListProps {
  date: string
  message: string
  user?: boolean
  error?: boolean
}

const scrollRef = ref<HTMLDivElement>()

const ms = useMessage()

const value = ref('')

const loading = ref(false)

const list = ref<ListProps[]>([])

onMounted(initChat)

function initChat() {
  addMessage('Hi, I am ChatGPT, a chatbot based on GPT-3.', false)
}

function handleClear() {
  list.value = []
  setTimeout(initChat, 200)
}

function handleEnter(event: KeyboardEvent) {
  if (event.key === 'Enter')
    handleSubmit()
}

async function handleSubmit() {
  if (!value.value) {
    ms.warning('Please enter a message')
    return
  }

  addMessage(value.value, true)

  try {
    loading.value = true
    const { text } = await fetchChatAPI(value.value)
    value.value = ''
    addMessage(text, false)
  }
  catch (error: any) {
    addMessage(error.message ?? 'Request failed, please try again later.', false, true)
  }
  finally {
    loading.value = false
    scrollRef.value && (scrollRef.value.scrollTop = scrollRef.value.scrollHeight)
  }
}

function addMessage(message: string, user = false, error = false) {
  list.value.push({
    date: new Date().toLocaleString(),
    message,
    user,
    error,
  })
}
</script>

<template>
  <div class="flex flex-col h-full overflow-hidden border rounded-md shadow-md">
    <header class="flex items-center justify-between p-4">
      <div>会话</div>
      <div>
        <button
          class="w-[40px] h-[40px] rounded-full hover:bg-neutral-100 transition flex justify-center items-center"
          @click="handleClear"
        >
          <SvgIcon icon="ri:delete-bin-6-line" />
        </button>
      </div>
    </header>
    <main class="flex-1 overflow-hidden border-y">
      <div ref="scrollRef" class="h-full p-4 overflow-hidden overflow-y-auto">
        <div>
          <Message
            v-for="(item, index) of list" :key="index" :date="item.date" :message="item.message"
            :user="item.user"
          />
        </div>
      </div>
    </main>
    <footer class="p-4">
      <div class="flex items-center justify-between space-x-2">
        <NInput v-model:value="value" placeholder="Type a message" :disabled="loading" @keyup="handleEnter" />
        <NButton type="primary" :loading="loading" @click="handleSubmit">
          <SvgIcon icon="ri:send-plane-fill" />
        </NButton>
      </div>
    </footer>
  </div>
</template>
