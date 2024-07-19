<script setup lang="ts">
import { computed, ref } from 'vue'
import { fetchEventSource } from '@microsoft/fetch-event-source'
import { NButton, NInput, NSelect } from 'naive-ui'
import { t } from '@/locales'
import { useBasicLayout } from '@/hooks/useBasicLayout'
import { useScroll } from '@/views/chat/hooks/useScroll'
import { Message } from '@/views/chat/components'
import { getPdfChatList } from '@/api/pdfChat'
import { SvgIcon } from '@/components/common'
import type { Chat } from '@/api/typing'
import { Role } from '@/api/typing'
import type { PageSummary } from '@/views/pdf/index.vue'
interface Props {
  pdfId: string
  pageList: PageSummary[]
}

const props = defineProps<Props>()
const pdfId = props.pdfId

const { isMobile } = useBasicLayout()
const loading = ref<boolean>(false)
const prompt = ref<string>('')
const buttonDisabled = computed(() => {
  return loading.value || !prompt.value || prompt.value.trim() === ''
})
const { scrollRef, scrollToBottom, scrollToBottomIfAtBottom } = useScroll()
const footerClass = computed(() => {
  let classes = ['p-4']
  if (isMobile.value)
    classes = ['sticky', 'left-0', 'bottom-0', 'right-0', 'p-2', 'pr-3', 'overflow-hidden']
  return classes
})
const placeholder = computed(() => {
  if (isMobile.value)
    return t('chat.placeholderMobile')
  return t('chat.placeholder')
})

const pageOptions = ref(props.pageList.map(page => ({
  label: page.pagePosition,
  value: page.pageId,
})))

const selectPdfIdList = ref<string[]>([])

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
const pdfChatList = ref<Chat[][]>([])
const lastPdfChatId = ref<string>('')
getPdfChatList(pdfId).then((result) => {
  // 假设result是一个PdfChat[]数组，我们需要将其转换为Chat[][]
  // 这里需要根据实际的数据结构进行调整
  pdfChatList.value = result.data.map(pdfChat => pdfChat.messages.map(message => ({
    text: message.content,
    inversion: message.role === Role.User, // 假设Role是一个枚举或类型，包含INVERSION值
    error: false,
    loading: false,
  })))

  const lastPdfChat = result.data[result.data.length - 1]
  lastPdfChatId.value = lastPdfChat.pdfChatId
  console.log(pdfChatList.value)
})

function handleSubmit() {
  onConversation()
}

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
  const lastDataSources = pdfChatList.value[pdfChatList.value.length - 1]
  scrollToBottom()
  lastDataSources.push(userChat)

  loading.value = true
  prompt.value = ''

  const assistantChat: Chat = {
    text: t('chat.thinking'),
    loading: true,
    inversion: false,
    error: false,
  }
  lastDataSources.push(assistantChat)
  scrollToBottom()

  try {
    const params = {
      pdfChatId: lastPdfChatId.value,
      question: message,
      historyCount: 0,
      pdfPageIdList: selectPdfIdList.value,
    }
    const lastText = ''
    const baseUrl = import.meta.env.VITE_APP_API_BASE_URL
    const url = `${baseUrl}pdf-chat/completion/chat`
    const fetchChatAPIOnce = async () => {
      fetchEventSource(url, {
        method: 'POST',
        body: JSON.stringify(params),
        headers: {
          'Content-Type': 'application/json',
        },
        retry: false,
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
              lastDataSources[lastDataSources.length - 1].text = ''
            }
            else if ('content' in data) {
              if (lastDataSources.length > 0) {
                // 修改 dataSources 数组的最后一个元素的 text 属性
                lastDataSources[lastDataSources.length - 1].text += data.content
                console.log(data.content)
              }
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
          lastDataSources[lastDataSources.length - 1].loading = false
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
scrollToBottom()
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
        >
          <div id="image-wrapper" class="relative h-full">
            <div v-for="(dataList, index) of pdfChatList">
              <div>以下是新对话</div>
              <Message
                v-for="(item, index) of dataList"
                :key="index"
                :text="item.text"
                :inversion="item.inversion"
                :error="item.error"
                :loading="item.loading"
                @regenerate="onRegenerate(index)"
                @delete="handleDelete(index)"
              />
            </div>
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
    </main>
    <footer :class="footerClass">
      <div class="w-full max-w-screen-xl m-auto">
        <div class="flex items-center justify-between space-x-2">
          <n-select v-model:value="selectPdfIdList" multiple :options="pageOptions" />
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
