<script setup lang='ts'>
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { NButton, NInput, useDialog } from 'naive-ui'
import { Message } from './components'
import { useScroll } from './hooks/useScroll'
import { useChat } from './hooks/useChat'
import { HoverButton, SvgIcon } from '@/components/common'
import { useBasicLayout } from '@/hooks/useBasicLayout'
import { useChatStore } from '@/store'
import { fetchChatAPIProcess } from '@/api'

let controller = new AbortController()

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

function handleSubmit() {
  onConversation()
}

async function onConversation() {
  const message = prompt.value

  if (loading.value)
    return

  if (!message || message.trim() === '')
    return

  controller = new AbortController()

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
      text: 'Aha, Thinking...',
      loading: true,
      inversion: false,
      error: false,
      conversationOptions: null,
      requestOptions: { prompt: message, options: { ...options } },
    },
  )
  scrollToBottom()

  let offset = 0
  try {
    await fetchChatAPIProcess<Chat.ConversationResponse>({
      prompt: message,
      options,
      signal: controller.signal,
      onDownloadProgress: ({ event }) => {
        const xhr = event.target
        const { responseText } = xhr
        const chunk = responseText.substring(offset)
        offset = responseText.length
        try {
          const data = JSON.parse(chunk)
          updateChat(
            +uuid,
            dataSources.value.length - 1,
            {
              dateTime: new Date().toLocaleString(),
              text: data.text ?? '',
              inversion: false,
              error: false,
              loading: false,
              conversationOptions: { conversationId: data.conversationId, parentMessageId: data.id },
              requestOptions: { prompt: message, options: { ...options } },
            },
          )
          scrollToBottom()
        }
        catch (error) {
          //
        }
      },
    })
  }
  catch (error: any) {
    let errorMessage = error?.message ?? 'Something went wrong, please try again later.'

    if (error.message === 'canceled')
      errorMessage = 'Request canceled. Please try again.'

    updateChat(
      +uuid,
      dataSources.value.length - 1,
      {
        dateTime: new Date().toLocaleString(),
        text: errorMessage,
        inversion: false,
        error: true,
        loading: false,
        conversationOptions: null,
        requestOptions: { prompt: message, options: { ...options } },
      },
    )
    scrollToBottom()
  }
  finally {
    offset = 0
    loading.value = false
  }
}

async function onRegenerate(index: number) {
  if (loading.value)
    return

  controller = new AbortController()

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
      text: 'Aha, Let me think again...',
      inversion: false,
      error: false,
      loading: true,
      conversationOptions: null,
      requestOptions: { prompt: message, ...options },
    },
  )

  let offset = 0
  try {
    await fetchChatAPIProcess<Chat.ConversationResponse>({
      prompt: message,
      options,
      signal: controller.signal,
      onDownloadProgress: ({ event }) => {
        const xhr = event.target
        const { responseText } = xhr
        const chunk = responseText.substring(offset)
        offset = responseText.length
        try {
          const data = JSON.parse(chunk)
          updateChat(
            +uuid,
            index,
            {
              dateTime: new Date().toLocaleString(),
              text: data.text ?? '',
              inversion: false,
              error: false,
              loading: false,
              conversationOptions: { conversationId: data.conversationId, parentMessageId: data.id },
              requestOptions: { prompt: message, ...options },
            },
          )
        }
        catch (error) {
          //
        }
      },
    })
  }
  catch (error: any) {
    let errorMessage = error?.message ?? 'Something went wrong, please try again later.'

    if (error.message === 'canceled')
      errorMessage = 'Request canceled. Please try again.'

    updateChat(
      +uuid,
      index,
      {
        dateTime: new Date().toLocaleString(),
        text: errorMessage,
        inversion: false,
        error: true,
        loading: false,
        conversationOptions: null,
        requestOptions: { prompt: message, ...options },
      },
    )
  }
  finally {
    loading.value = false
    offset = 0
  }
}

function handleClear() {
  if (loading.value)
    return

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

const buttonDisabled = computed(() => {
  return loading.value || !prompt.value || prompt.value.trim() === ''
})

const wrapClass = computed(() => {
  if (isMobile.value)
    return ['pt-14', 'pb-14']

  return []
})

const footerClass = computed(() => {
  let classes = ['p-4']
  if (isMobile.value)
    classes = ['p-2', 'pr-4', 'fixed', 'bottom-4', 'left-0', 'right-0', 'z-30', 'h-14', 'overflow-hidden']
  return classes
})

onMounted(() => {
  scrollToBottom()
})

onUnmounted(() => {
  if (loading.value)
    controller.abort()
})
</script>

<template>
  <div class="flex flex-col h-full" :class="wrapClass">
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
              v-for="(item, index) of dataSources"
              :key="index"
              :date-time="item.dateTime"
              :text="item.text"
              :inversion="item.inversion"
              :error="item.error"
              :loading="item.loading"
              @regenerate="onRegenerate(index)"
            />
          </div>
        </template>
      </div>
    </main>
    <footer :class="footerClass">
      <div class="flex items-center justify-between space-x-2">
        <HoverButton @click="handleClear">
          <span class="text-xl text-[#4f555e]">
            <SvgIcon icon="ri:delete-bin-line" />
          </span>
        </HoverButton>
        <NInput
          v-model:value="prompt"
          type="textarea"
          :autosize="{ minRows: 1, maxRows: 2 }"
          placeholder="Ask me anything..."
          @keypress="handleEnter"
        />
        <NButton type="primary" :disabled="buttonDisabled" @click="handleSubmit">
          <template #icon>
            <SvgIcon icon="ri:send-plane-fill" />
          </template>
        </NButton>
      </div>
    </footer>
  </div>
</template>
