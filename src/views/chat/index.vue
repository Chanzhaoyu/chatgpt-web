<script setup lang='ts'>
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { NButton, NInput, useDialog } from 'naive-ui'
import { Message } from './components'
import { useScroll } from './hooks/useScroll'
import { useChat } from './hooks/useChat'
import { HoverButton, SvgIcon } from '@/components/common'
import { useBasicLayout } from '@/hooks/useBasicLayout'
import { useChatStore } from '@/store'
import { fetchChatAPI } from '@/api'

const route = useRoute()
const dialog = useDialog()

const chatStore = useChatStore()

const { isMobile } = useBasicLayout()
const { addChat, updateChat } = useChat()
const { scrollRef, scrollToBottom } = useScroll()

const { uuid } = route.params as { uuid: string }

const dataSources = computed(() => chatStore.getChatByUuid(+uuid))
const conversationList = computed(() => dataSources.value.filter(item => (!item.inversion && !item.error)))

const prompt = ref<string>('')
const loading = ref<boolean>(false)

const footerMobileStyle = computed(() => ([]))

function handleSubmit() {
  onConversation()
}

async function onConversation() {
  const message = prompt.value

  if (loading.value || !message || message.trim() === '')
    return

  addChat(
    +uuid,
    {
      dateTime: new Date().toLocaleString(),
      text: message,
      inversion: true,
      error: false,
      conversationOptions: null,
      requestOptions: { prompt: message, options: null },
    },
  )
  scrollToBottom()

  loading.value = true
  prompt.value = ''

  let options: Chat.ConversationRequest = {}
  const lastContext = conversationList.value[conversationList.value.length - 1]?.conversationOptions

  if (lastContext)
    options = { ...lastContext }

  addChat(
    +uuid,
    {
      dateTime: new Date().toLocaleString(),
      text: 'Thinking...',
      inversion: false,
      error: false,
      conversationOptions: null,
      requestOptions: { prompt: message, options: { ...options } },
    },
  )
  scrollToBottom()

  try {
    const { data } = await fetchChatAPI<Chat.ConversationResponse>(message, options)
    updateChat(
      +uuid,
      dataSources.value.length - 1,
      {
        dateTime: new Date().toLocaleString(),
        text: data.text ?? '',
        inversion: false,
        error: false,
        conversationOptions: { conversationId: data.conversationId, parentMessageId: data.id },
        requestOptions: { prompt: message, options: { ...options } },
      },
    )
    scrollToBottom()
  }
  catch (error: any) {
    updateChat(
      +uuid,
      dataSources.value.length - 1,
      {
        dateTime: new Date().toLocaleString(),
        text: error?.message ?? '',
        inversion: false,
        error: true,
        conversationOptions: null,
        requestOptions: { prompt: message, options: { ...options } },
      },
    )
    scrollToBottom()
  }
  finally {
    loading.value = false
  }
}

async function handleRegenerate(index: number) {
  if (loading.value)
    return

  loading.value = true

  const { requestOptions } = dataSources.value[index]

  const message = requestOptions?.prompt ?? ''

  let options: Chat.ConversationRequest = {}

  if (requestOptions.options)
    options = { ...requestOptions.options }

  loading.value = true

  updateChat(
    +uuid,
    index,
    {
      dateTime: new Date().toLocaleString(),
      text: 'Let me think again...',
      inversion: false,
      error: false,
      conversationOptions: null,
      requestOptions: { prompt: message, ...options },
    },
  )
  scrollToBottom()

  try {
    const { data } = await fetchChatAPI<Chat.ConversationResponse>(message, options)
    updateChat(
      +uuid,
      index,
      {
        dateTime: new Date().toLocaleString(),
        text: data.text ?? '',
        inversion: false,
        error: false,
        conversationOptions: { conversationId: data.conversationId, parentMessageId: data.id },
        requestOptions: { prompt: message, ...options },
      },
    )
    scrollToBottom()
  }
  catch (error: any) {
    updateChat(
      +uuid,
      index,
      {
        dateTime: new Date().toLocaleString(),
        text: error?.message ?? '',
        inversion: false,
        error: true,
        conversationOptions: null,
        requestOptions: { prompt: message, ...options },
      },
    )
    scrollToBottom()
  }
  finally {
    loading.value = false
  }
}

function handleClear() {
  dialog.warning({
    title: 'Clear Chat',
    content: 'Are you sure to clear this chat?',
    positiveText: 'Yes',
    negativeText: 'No',
    onPositiveClick: () => {
      chatStore.clearChatByUuid(+uuid)
    },
  })
}

function handleEnter(event: KeyboardEvent) {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault()
    handleSubmit()
  }
}

onMounted(() => {
  scrollToBottom()
})
</script>

<template>
  <div class="flex flex-col h-full">
    <main class="flex-1 overflow-hidden">
      <div ref="scrollRef" class="h-full p-4 overflow-hidden overflow-y-auto" :class="[{ 'p-2': isMobile }]">
        <template v-if="!dataSources.length">
          <div class="flex items-center justify-center mt-4 text-center text-neutral-300">
            <SvgIcon icon="ri:bubble-chart-fill" class="mr-2 text-3xl" />
            <span>Aha~</span>
          </div>
        </template>
        <template v-else>
          <div>
            <Message
              v-for="(item, index) of dataSources" :key="index" :date-time="item.dateTime" :text="item.text"
              :inversion="item.inversion" :error="item.error" @regenerate="handleRegenerate(index)"
            />
          </div>
        </template>
      </div>
    </main>
    <footer class="p-4" :class="footerMobileStyle">
      <div class="flex items-center justify-between space-x-2">
        <HoverButton @click="handleClear">
          <span class="text-xl text-[#4f555e]">
            <SvgIcon icon="ri:delete-bin-line" />
          </span>
        </HoverButton>
        <NInput
          v-model:value="prompt" type="textarea" :autosize="{ minRows: 1, maxRows: 2 }"
          placeholder="Ask me anything..." @keypress="handleEnter"
        />
        <NButton type="primary" :loading="loading" @click="handleSubmit">
          <template #icon>
            <SvgIcon icon="ri:send-plane-fill" />
          </template>
        </NButton>
      </div>
    </footer>
  </div>
</template>
