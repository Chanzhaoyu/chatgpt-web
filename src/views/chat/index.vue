<!-- eslint-disable no-unused-expressions -->
<!-- eslint-disable no-console -->
<script setup lang='ts'>
import type { Ref } from 'vue'
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { NButton, NInput, useDialog, useMessage } from 'naive-ui'
import { toPng } from 'html-to-image'
import { useScroll } from './hooks/useScroll'
import { useChat } from './hooks/useChat'
import { useUsingContext } from './hooks/useUsingContext'
import HeaderComponent from './components/Header/index.vue'
import { SvgIcon } from '@/components/common'
import { useBasicLayout } from '@/hooks/useBasicLayout'
import { useAppStore, useChatStore } from '@/store'
import { fetchChatAPIProcess, fetchNewChatAPIProcess, newChat } from '@/api'
import { t } from '@/locales'
import { agentHello } from '@/api/agentChat'
import AgentExampleQuestion from '@/views/chat/components/main/AgentExampleQuestion.vue'
import { type AgentPreview, agentList } from '@/views/chat/components/agentList'

let controller = new AbortController()

const openLongReply = import.meta.env.VITE_GLOB_OPEN_LONG_REPLY === 'true'

const route = useRoute()
const router = useRouter()
const agent = route.params.agent

const dialog = useDialog()
const ms = useMessage()
const chatStore = useChatStore()
const { isMobile } = useBasicLayout()
const { addChat, updateChat, updateChatSome, getChatByUuidAndIndex } = useChat()
const { scrollRef, scrollToBottom, scrollToBottomIfAtBottom } = useScroll()
const { usingContext, toggleUsingContext } = useUsingContext()

const appStore = useAppStore()
const prompt = ref<string>('')
const loading = ref<boolean>(false)
const inputRef = ref<Ref | null>(null)
const isDone = ref(false)
// 添加PromptStore
// const promptStore = usePromptStore()

// 使用storeToRefs，保证store修改后，联想部分能够重新渲染
// const { promptList: promptTemplate } = storeToRefs<any>(promptStore)

// 未知原因刷新页面，loading 状态不会重置，手动重置
// dataSources.value.forEach((item, index) => {
//   if (item.loading)
//     updateChatSome(chatStore.active, index, { loading: false })
// })
const agentIcon = ref<string>('')
agentIcon.value = agentList.find((item: AgentPreview) => item.agent === agent)?.iconSrc || ''

async function handleSubmit() {
  // const activateAgent = chatStore.history.find(item => item.uuid === chatStore.active)
  // if (activateAgent?.isAgent) {
  //   const response: { data: number } = await newChat({ agent: 'bus_agent' })
  //   const { data } = response
  //   chatStore.addHistory({ title: prompt.value, uuid: data, isEdit: false, isAgent: false })
  if (route.name === 'AgentHome') {
    // console.log('chatId is undefined')
    const response: { data: string } = await newChat({ agent })
    router.push({ name: 'Chat', params: { agent, chatId: response.data.toString() } })
  }

  onConversation()

  if (isMobile.value)
    appStore.setSiderCollapsed(true)
}

// onConversation()

async function onConversation() {
  const message = prompt.value
  if (loading.value)
    return

  if (!message || message.trim() === '')
    return

  controller = new AbortController()
  addChat(
    chatStore.active,
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

  if (lastContext && usingContext.value)
    options = { ...lastContext }

  addChat(
    chatStore.active,
    {
      dateTime: new Date().toLocaleString(),
      text: t('chat.thinking'),
      loading: true,
      inversion: false,
      error: false,
      conversationOptions: null,
      requestOptions: { prompt: message, options: { ...options } },
    },
  )
  scrollToBottom()

  try {
    const lastText = ''
    const fetchChatAPIOnce = async () => {
      await fetchNewChatAPIProcess<Chat.ConversationResponse>({
        chatId: chatStore.active?.toString(),
        question: message,
        options,
        signal: controller.signal,
        onDownloadProgress: ({ event }) => {
          const xhr = event.target
          const { responseText } = xhr
          let accumulatedData = responseText
          const contentText = ref('')
          if (!isDone.value && responseText.includes('event:DONE')) {
            isDone.value = true
            // 移除DONE事件及其后的数据，确保只处理实际内容
            accumulatedData = accumulatedData.split('event:DONE')[0].trim()

            // 分割数据块并处理
            const dataChunks = accumulatedData.split('\n\n')
            dataChunks.forEach((chunk: any) => {
              try {
                const newChunk = chunk.split('data:')[1].trim()
                const jsonData = JSON.parse(newChunk)
                // 这里处理每个JSON对象，例如：
                // console.log(jsonData.content) // 打印每一块的"content"
                // 根据您的需求，可以在这里调用相应的函数来处理每一块数据
                contentText.value += jsonData.content
              }
              catch (error) {
                console.error('Error parsing JSON chunk:', error, 'Chunk:', chunk)
              }
            })

            // // 清理状态，准备下一次处理
            accumulatedData = ''
            isDone.value = false
          }
          // console.log(xhr, 'event')
          // Always process the final line
          // const lastIndex = responseText.lastIndexOf('\n', responseText.length - 1)
          // let chunk = responseText
          // // console.log(chunk, 'chunk')
          // if (lastIndex !== -1)
          //   chunk = responseText.substring(lastIndex)
          // // console.log(lastIndex, 'responseText')
          console.log(contentText.value, 'contentText')
          try {
            const data = { text: contentText.value, conversationId: Date.now().toString(), id: Date.now() }
            // const data = JSON.parse(chunk)
            updateChat(
              chatStore.active,
              dataSources.value.length - 1,
              {
                dateTime: new Date().toLocaleString(),
                text: lastText + (data.text ?? ''),
                inversion: false,
                error: false,
                loading: true,
                conversationOptions: { conversationId: data.conversationId, parentMessageId: data.id },
                requestOptions: { prompt: message, options: { ...options } },
              },
            )

            // if (openLongReply && data.detail.choices[0].finish_reason === 'length') {
            //   options.parentMessageId = data.id
            //   lastText = data.text
            //   message = ''
            //   return fetchChatAPIOnce()
            // }

            scrollToBottomIfAtBottom()
          }
          catch (error) {
            // console.log(error, 'error')
          }
        },
      })
      updateChatSome(chatStore.active, dataSources.value.length - 1, { loading: false })
    }

    await fetchChatAPIOnce()
  }
  catch (error: any) {
    const errorMessage = error?.message ?? t('common.wrong')

    if (error.message === 'canceled') {
      updateChatSome(
        chatStore.active,
        dataSources.value.length - 1,
        {
          loading: false,
        },
      )
      scrollToBottomIfAtBottom()
      return
    }

    const currentChat = getChatByUuidAndIndex(chatStore.active, dataSources.value.length - 1)

    if (currentChat?.text && currentChat.text !== '') {
      updateChatSome(
        chatStore.active,
        dataSources.value.length - 1,
        {
          text: `${currentChat.text}\n[${errorMessage}]`,
          error: false,
          loading: false,
        },
      )
      return
    }

    updateChat(
      chatStore.active,
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
    scrollToBottomIfAtBottom()
  }
  finally {
    loading.value = false
  }
}

async function onRegenerate(index: number) {
  if (loading.value)
    return

  controller = new AbortController()

  const { requestOptions } = dataSources.value[index]

  let message = requestOptions?.prompt ?? ''

  let options: Chat.ConversationRequest = {}

  if (requestOptions.options)
    options = { ...requestOptions.options }

  loading.value = true

  updateChat(
    chatStore.active,
    index,
    {
      dateTime: new Date().toLocaleString(),
      text: '',
      inversion: false,
      error: false,
      loading: true,
      conversationOptions: null,
      requestOptions: { prompt: message, options: { ...options } },
    },
  )

  try {
    let lastText = ''
    const fetchChatAPIOnce = async () => {
      await fetchChatAPIProcess<Chat.ConversationResponse>({
        prompt: message,
        options,
        signal: controller.signal,
        onDownloadProgress: ({ event }) => {
          const xhr = event.target
          const { responseText } = xhr
          // Always process the final line
          const lastIndex = responseText.lastIndexOf('\n', responseText.length - 2)
          let chunk = responseText
          if (lastIndex !== -1)
            chunk = responseText.substring(lastIndex)
          try {
            const data = JSON.parse(chunk)
            updateChat(
              chatStore.active,
              index,
              {
                dateTime: new Date().toLocaleString(),
                text: lastText + (data.text ?? ''),
                inversion: false,
                error: false,
                loading: true,
                conversationOptions: { conversationId: data.conversationId, parentMessageId: data.id },
                requestOptions: { prompt: message, options: { ...options } },
              },
            )

            if (openLongReply && data.detail.choices[0].finish_reason === 'length') {
              options.parentMessageId = data.id
              lastText = data.text
              message = ''
              return fetchChatAPIOnce()
            }
          }
          catch (error) {
            //
          }
        },
      })
      updateChatSome(chatStore.active, index, { loading: false })
    }
    await fetchChatAPIOnce()
  }
  catch (error: any) {
    if (error.message === 'canceled') {
      updateChatSome(
        chatStore.active,
        index,
        {
          loading: false,
        },
      )
      return
    }

    const errorMessage = error?.message ?? t('common.wrong')

    updateChat(
      chatStore.active,
      index,
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
  }
  finally {
    loading.value = false
  }
}

function handleExport() {
  if (loading.value)
    return

  const d = dialog.warning({
    title: t('chat.exportImage'),
    content: t('chat.exportImageConfirm'),
    positiveText: t('common.yes'),
    negativeText: t('common.no'),
    onPositiveClick: async () => {
      try {
        d.loading = true
        const ele = document.getElementById('image-wrapper')
        const imgUrl = await toPng(ele as HTMLDivElement)
        const tempLink = document.createElement('a')
        tempLink.style.display = 'none'
        tempLink.href = imgUrl
        tempLink.setAttribute('download', 'chat-shot.png')
        if (typeof tempLink.download === 'undefined')
          tempLink.setAttribute('target', '_blank')
        document.body.appendChild(tempLink)
        tempLink.click()
        document.body.removeChild(tempLink)
        window.URL.revokeObjectURL(imgUrl)
        d.loading = false
        ms.success(t('chat.exportSuccess'))
        Promise.resolve()
      }
      catch (error: any) {
        ms.error(t('chat.exportFailed'))
      }
      finally {
        d.loading = false
      }
    },
  })
}

function handleDelete(index: number) {
  if (loading.value)
    return

  dialog.warning({
    title: t('chat.deleteMessage'),
    content: t('chat.deleteMessageConfirm'),
    positiveText: t('common.yes'),
    negativeText: t('common.no'),
    onPositiveClick: () => {
      chatStore.deleteChatByUuid(chatStore.active, index)
    },
  })
}

function handleClear() {
  if (loading.value)
    return

  dialog.warning({
    title: t('chat.clearChat'),
    content: t('chat.clearChatConfirm'),
    positiveText: t('common.yes'),
    negativeText: t('common.no'),
    onPositiveClick: () => {
      chatStore.clearChatByUuid(chatStore.active)
    },
  })
}

function handleEnter(event: KeyboardEvent) {
  if (!isMobile.value) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      handleSubmit()
    }
  }
  else {
    if (event.key === 'Enter' && event.ctrlKey) {
      event.preventDefault()
      handleSubmit()
    }
  }
}

function handleStop() {
  if (loading.value) {
    controller.abort()
    loading.value = false
  }
}

// 可优化部分
// 搜索选项计算，这里使用value作为索引项，所以当出现重复value时渲染异常(多项同时出现选中效果)
// 理想状态下其实应该是key作为索引项,但官方的renderOption会出现问题，所以就需要value反renderLabel实现
const searchOptions = computed(() => {
  if (prompt.value.startsWith('/')) {
    return promptTemplate.value.filter((item: {
      key: string
    }) => item.key.toLowerCase().includes(prompt.value.substring(1).toLowerCase())).map((obj: { value: any }) => {
      return {
        label: obj.value,
        value: obj.value,
      }
    })
  }
  else {
    return []
  }
})

// value反渲染key
const renderOption = (option: { label: string }) => {
  for (const i of promptTemplate.value) {
    if (i.value === option.label)
      return [i.key]
  }
  return []
}

const placeholder = computed(() => {
  if (isMobile.value)
    return t('chat.placeholderMobile')
  return t('chat.placeholder')
})

const buttonDisabled = computed(() => {
  return loading.value || !prompt.value || prompt.value.trim() === ''
})

const footerClass = computed(() => {
  let classes = ['p-4']
  if (isMobile.value)
    classes = ['sticky', 'left-0', 'bottom-0', 'right-0', 'p-2', 'pr-3', 'overflow-hidden']
  return classes
})

onMounted(() => {
  scrollToBottom()
  if (inputRef.value && !isMobile.value)
    inputRef.value?.focus()
})

onUnmounted(() => {
  if (loading.value)
    controller.abort()
})

const agenthello = ref('')
agentHello({ agent }).then((res) => {
  if (res.data)
    agenthello.value = res.data
})
</script>

<template>
  <div class="flex flex-col w-full h-full">
    <HeaderComponent
      v-if="isMobile"
      :using-context="usingContext"
      @export="handleExport"
      @handle-clear="handleClear"
    />
    <main class="flex-1 overflow-hidden">
      <div id="scrollRef" ref="scrollRef" class="h-full overflow-hidden overflow-y-auto">
        <div
          class="h-full w-full max-w-screen-xl m-auto dark:bg-[#101014]"
          :class="[isMobile ? 'p-2' : 'p-4']"
        >
          <div id="image-wrapper" class="relative h-full">
            <template>
              <div class="flex h-full items-center justify-center mt-4 text-center text-neutral-300 flex-col">
                <div class="flex justify-center w-full items-center">
                  <img :src="agentIcon" alt="logo" />
                  <div class="flex justify-center items-center flex-col" style="margin-left: 5%;">
                    <!--                    <span style="color: #1B2559;font-size: 28px;font-weight: bolder">👋 你好，我是AI薯塔，</span> -->
                    <!--                    <span style="color: #1B2559;font-size: 28px;font-weight: bolder">我可以告诉你最新的龙大资讯🙋</span> -->
                    <span style="color: #1B2559;font-size: 28px;font-weight: bolder">{{ agenthello }}</span>
                  </div>
                </div>
                <AgentExampleQuestion />
              </div>
            </template>
          </div>
        </div>
      </div>
    </main>
    <footer :class="footerClass">
      <div class="w-full max-w-screen-xl m-auto">
        <div class="flex items-center justify-between space-x-2">
          <NInput
            ref="inputRef"
            v-model:value="prompt"
            class="prompt-input"
            type="textarea"
            size="large"
            :placeholder="placeholder"
            :autosize="{ minRows: 1, maxRows: isMobile ? 4 : 8 }"
            @input="handleInput"
            @focus="handleFocus"
            @blur="handleBlur"
            @keypress="handleEnter"
          />
          <NButton type="primary" :disabled="buttonDisabled" class="send-button" @click="handleSubmit">
            <template #icon>
              <span class="dark:text-black">
                <SvgIcon icon="ri:send-plane-fill" />
              </span>
            </template>
          </NButton>
        </div>
      </div>
    </footer>
  </div>
</template>

<style scoped lang="scss">
:deep(.n-input) {
	border-radius: 40px;
}

.send-button {
	width: var(--n-width);
	height: var(--n-height);
}

.tips {
	width: 47.5%;
	height: 100%;
	margin-top: 3%;

	.tips-title {
		font-size: 16px
	}

	.tips-text {
		font-size: 16px;
		color: black;
		margin-left: 3%
	}

	.tips-button {
		background-color: #CDC7EB;
		border-radius: 10px;
		height: 10%;
		margin-bottom: 3%;
		cursor: pointer;
	}
}
</style>
