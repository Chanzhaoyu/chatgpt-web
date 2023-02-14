<script setup lang='ts'>
import { computed, nextTick, onMounted, ref, watch } from 'vue'
import { NButton, NInput, useMessage } from 'naive-ui'
import { Message } from './components'
import { Layout } from './layout'
import { useChat } from './hooks/useChat'
import { fetchChatAPI } from '@/api'
import { HoverButton, SvgIcon } from '@/components/common'
import { useHistoryStore } from '@/store'
import { isNumber } from '@/utils/is'

let controller = new AbortController()

const ms = useMessage()

const historyStore = useHistoryStore()

const scrollRef = ref<HTMLDivElement>()

const { addChat, clearChat: handleClear } = useChat()

const prompt = ref('')
const loading = ref(false)

const currentActive = computed(() => historyStore.active)

const list = computed<Chat.Chat[]>(() => historyStore.getCurrentChat)
const chatList = computed<Chat.Chat[]>(() => list.value.filter(item => (!item.reversal && !item.error)))

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

  let options: Chat.ChatOptions = {}
  const lastContext = chatList.value[chatList.value.length - 1]?.options

  if (lastContext)
    options = { ...lastContext }

  try {
    loading.value = true
    const { data } = await fetchChatAPI(message, options, controller.signal)
    addMessage(data?.text ?? '', { options: { conversationId: data.conversationId, parentMessageId: data.id } })
  }
  catch (error: any) {
    if (error.message !== 'cancelled')
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
  args?: { reversal?: boolean; error?: boolean; options?: Chat.ChatOptions },
  uuid?: number | null,
) {
  addChat(message, args, uuid)
  scrollToBottom()
}

function scrollToBottom() {
  nextTick(() => scrollRef.value && (scrollRef.value.scrollTop = scrollRef.value.scrollHeight))
}

function handleCancel() {
  // 取消之后一定要重新赋值，否则会报错
  controller.abort()
  controller = new AbortController()
  loading.value = false
}

onMounted(() => {
  scrollToBottom()
})

watch(
  currentActive,
  (active) => {
    if (isNumber(active)) {
      handleCancel()
      scrollToBottom()
    }
  },
)
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
          <HoverButton tooltip="Clear conversations">
            <span class="text-xl text-[#4f555e]" @click="handleClear">
              <SvgIcon icon="ri:delete-bin-line" />
            </span>
          </HoverButton>
          <NInput v-model:value="prompt" placeholder="Type a message..." @keypress="handleEnter" />
          <NButton type="primary" :loading="loading" @click="handleCancel">
            <template #icon>
              <SvgIcon icon="ri:send-plane-fill" />
            </template>
          </NButton>
        </div>
      </footer>
    </div>
  </Layout>
</template>
