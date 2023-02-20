<script setup lang='ts'>
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { NButton, NInput } from 'naive-ui'
import { Message } from './components'
import { useScroll } from './hooks/useScroll'
import { useChat } from './hooks/useChat'
import { HoverButton, SvgIcon } from '@/components/common'
import { useBasicLayout } from '@/hooks/useBasicLayout'
import { useChatStore } from '@/store'

const route = useRoute()
const chatStore = useChatStore()

const { isMobile } = useBasicLayout()
const { addChat, updateChat } = useChat()
const { scrollRef, scrollToBottom } = useScroll()

const { uuid } = route.params as { uuid: string }

const dataSources = computed(() => chatStore.getChatByUuid(+uuid))

const prompt = ref<string>('')
const loading = ref<boolean>(false)

const footerMobileStyle = computed(() => ([]))

function handleSubmit() {
  if (loading.value || !prompt.value)
    return

  addChat(
    +uuid,
    {
      dateTime: new Date().toLocaleString(),
      text: prompt.value,
      inversion: true,
      error: false,
    },
  )
  scrollToBottom()

  loading.value = true
  prompt.value = ''

  addChat(
    +uuid,
    {
      dateTime: new Date().toLocaleString(),
      text: 'Thinking...',
      inversion: false,
      error: false,
    },
  )

  setTimeout(() => {
    updateChat(
      +uuid,
      dataSources.value.length - 1,
      {
        dateTime: new Date().toLocaleString(),
        text: 'Hello, I am a chat bot.',
        inversion: false,
        error: false,
      },
    )

    scrollToBottom()
    loading.value = false
  }, 2 * 1000)
}

function handleRegenerate(index: number) {
  if (loading.value)
    return

  loading.value = true

  updateChat(
    +uuid,
    index,
    {
      dateTime: new Date().toLocaleString(),
      text: 'Thinking...',
      inversion: false,
      error: false,
    },
  )

  setTimeout(() => {
    updateChat(
      +uuid,
      index,
      {
        dateTime: new Date().toLocaleString(),
        text: 'Hello, I am a chat bot.',
        inversion: false,
        error: false,
      },
    )
    loading.value = false
  }, 2 * 1000)
}

function handleClear() {
  chatStore.clearChatByUuid(+uuid)
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
      <div
        ref="scrollRef"
        class="h-full p-4 overflow-hidden overflow-y-auto"
        :class="[{ 'p-2': isMobile }]"
      >
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
              @regenerate="handleRegenerate(index)"
            />
          </div>
        </template>
      </div>
    </main>
    <footer
      class="p-4"
      :class="footerMobileStyle"
    >
      <div class="flex items-center justify-between space-x-2">
        <HoverButton tooltip="Clear conversations" @click="handleClear">
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
        <NButton type="primary" :loading="loading" @click="handleSubmit">
          <template #icon>
            <SvgIcon icon="ri:send-plane-fill" />
          </template>
        </NButton>
      </div>
    </footer>
  </div>
</template>
