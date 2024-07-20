<script setup lang="ts">
import { NButton, NInput } from 'naive-ui'
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import { fetchEventSource } from '@microsoft/fetch-event-source'
import { SvgIcon } from '@/components/common'
import { useBasicLayout } from '@/hooks/useBasicLayout'
import { t } from '@/locales'
import { Message } from '@/views/chat/components'
import { agentHello, getMessages } from '@/api/agentChat'
import { useScroll } from '@/views/chat/hooks/useScroll'
import { Role } from '@/api/typing'
import type { Chat } from '@/api/typing'
import type { AgentPreview } from '@/views/chat/components/agentList'
import { agentList } from '@/views/chat/components/agentList'
const route = useRoute()
const agent: string = route.params.agent
const chatId: string = route.params.chatId
// const props = defineProps({
//   agent: String,
//   chatId: String,
// })
const loading = ref<boolean>(false)
const { isMobile } = useBasicLayout()
const prompt = ref<string>('')
const { scrollRef, scrollToBottom, scrollToBottomIfAtBottom } = useScroll()
const placeholder = computed(() => {
  if (isMobile.value)
    return t('chat.placeholderMobile')
  return t('chat.placeholder')
})
const buttonDisabled = computed(() => {
  return loading.value || !prompt.value || prompt.value.trim() === ''
})

const agentHelloWords = ref<string>('')
const agentIcon = ref<string>('')
agentIcon.value = agentList.find((item: AgentPreview) => item.agent === agent)?.iconSrc || ''
console.log(`agent${agent}`)
console.log(`agentIcon${agentIcon.value}`)

agentHello<string>({ agent }).then((res) => {
  if (res.data)
    agentHelloWords.value = res.data
})

const footerClass = computed(() => {
  let classes = ['p-4']
  if (isMobile.value)
    classes = ['sticky', 'left-0', 'bottom-0', 'right-0', 'p-2', 'pr-3', 'overflow-hidden']
  return classes
})

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

const dataSources = ref<Chat[]>([])

// 调用getMessages函数并处理响应
getMessages(chatId).then((res) => {
  if (res.data) {
    // 处理数据，特别是用户消息
    const processedMessages: Chat[] = res.data.map((message) => {
      const chat: Chat = {
        text: message.content || '',
        inversion: false, // 默认inversion为false
        error: false,
        loading: false,
      }

      // 如果消息角色是用户，则设置inversion为true
      if (message.role === Role.User)
        chat.inversion = true

      return chat
    })

    // 更新dataSources
    dataSources.value = processedMessages
  }
}).catch((error) => {
  console.error('Failed to fetch messages:', error)
})

function handleSubmit() {
  onConversation()
}

// const updateChat = (index, chat:Chat) => {
//
// }

async function onConversation() {
  const message = prompt.value
  if (loading.value)
    return
  if (!message || message.trim() === '')
    return
  const userChat: Chat = {
    text: message,
    inversion: true,
    error: false,
  }
  scrollToBottom()
  dataSources.value.push(userChat)

  loading.value = true
  prompt.value = ''

  const assistantChat: Chat = {
    text: t('chat.thinking'),
    loading: true,
    inversion: false,
    error: false,
  }
  dataSources.value.push(assistantChat)
  scrollToBottom()

  try {
    const params = {
      chatId,
      agent,
      question: message,
      historyCount: 10,
    }
    const lastText = ''
    const baseUrl = import.meta.env.VITE_APP_API_BASE_URL
    const url = `${baseUrl}chat/completion/chat-id`
    const fetchChatAPIOnce = async () => {
      fetchEventSource(url, {
        method: 'POST',
        body: JSON.stringify(params),
        headers: {
          'Content-Type': 'application/json',
        },
        // retry: false,
        openWhenHidden: true,

        // onopen: (response) => {
        //   console.log(response)
        // },
        async onopen(response) {

        },

        onmessage: (msg: { data: any; event: string }) => {
          // console.log(msg)
          try {
            const data = JSON.parse(msg.data)
            // console.log(audioData);
            if ('event' in data) {
              // 清空思考中这三个字
              dataSources.value[dataSources.value.length - 1].text = ''
              // console.log('text data')
              // answer.value += audioData.content;
              // response.value += audioData.content
            }
            else if ('content' in data) {
              if (dataSources.value.length > 0) {
                // 修改 dataSources 数组的最后一个元素的 text 属性
                dataSources.value[dataSources.value.length - 1].text += data.content
              }
              console.log(dataSources)
              // dataSources.value.at(dataSources.value.length - 1).text += data.content
            }
          }
          catch (e) {
            console.log(e)
          }
        },

        onclose() {
          // 正常结束的回调
          console.log('connection closed')
          dataSources.value[dataSources.value.length - 1].loading = false
          loading.value = false
        },
        onerror(err: any) {
          // 连接出现异常回调
          // 必须抛出错误才会停止
          console.log('connection error', err)
        },

      })
    }
    await fetchChatAPIOnce()
  }
  catch (error) {
    console.log(error)
  }
}

async function handleStop() {

}

async function onRegenerate(index: number) {

}

async function handleDelete(index: number) {

}
</script>

<template>
  <div class="flex flex-col w-full h-full">
    <main class="flex-1 overflow-hidden">
      <div id="scrollRef" ref="scrollRef" class="h-full overflow-hidden overflow-y-auto">
        <div
          class="h-full w-full max-w-screen-xl m-auto dark:bg-[#101014]"
          :class="[isMobile ? 'p-2' : 'p-4']"
        >
          <div id="image-wrapper" class="relative h-full">
            <div class="flex h-full items-center justify-center mt-4 text-center text-neutral-300 flex-col">
              <div class="flex justify-center w-full items-center">
                <img :src="agentIcon" alt="logo" />
                <div class="flex justify-center items-center flex-col" style="margin-left: 5%;">
                  <span style="color: #1B2559;font-size: 28px;font-weight: bolder">{{ agentHelloWords }}</span>
                </div>
              </div>
            </div>
            <div>
              <Message
                v-for="(item, index) of dataSources"
                :key="index"
                :text="item.text"
                :inversion="item.inversion"
                :error="item.error"
                :loading="item.loading"
                @regenerate="onRegenerate(index)"
                @delete="handleDelete(index)"
              />
              <div class="sticky bottom-0 left-0 flex justify-center">
                <NButton v-if="loading" type="warning" @click="handleStop">
                  <template #icon>
                    <SvgIcon icon="ri:stop-circle-line" />
                  </template>
                  {{ t('common.stopResponding') }}
                </NButton>
              </div>
            </div>
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
            type="textarea"
            :placeholder="placeholder"
            :autosize="{ minRows: 1, maxRows: isMobile ? 4 : 8 }"
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
