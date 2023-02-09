<script setup lang='ts'>
import { onMounted, ref } from 'vue'
import { NButton, NInput, NScrollbar, useMessage } from 'naive-ui'
import Message from './components/Message.vue'
import { SvgIcon } from '@/components'

const ms = useMessage()

const value = ref('')

const loading = ref(false)

const list = ref<{
  date: string
  message: string
  user?: boolean
}[]>([])

onMounted(initChat)

function initChat() {
  list.value = [
    {
      date: '1 minute ago',
      message: 'Hi, I am ChatGPT, a chatbot based on GPT-3.',
      user: false,
    },
  ]
}

function handleClear() {
  list.value = []
  setTimeout(initChat, 500)
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
  loading.value = true
  list.value.push({ date: '1 minute ago', message: value.value, user: true })
  const message = await mock()
  value.value = ''
  list.value.push({ date: '1 minute ago', message, user: false })
  loading.value = false
}

function mock(): Promise<string> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const message = 'ChatGPT 是一个基于深度学习的对话系统，可以用于自动生成聊天机器人的回答。它可以用于一些客服的工作，可以帮助客服团队处理大量的常见问题，从而提高工作效率。'
      resolve(message)
    }, 2000)
  })
}
</script>

<template>
  <div class="h-full p-4">
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
        <div class="h-full">
          <NScrollbar class="h-full p-4">
            <div>
              <Message
                v-for="(item, index) of list" :key="index" :date="item.date" :message="item.message"
                :user="item.user"
              />
            </div>
          </NScrollbar>
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
  </div>
</template>
