<!-- eslint-disable no-console -->
<script setup lang='ts'>
import { NScrollbar } from 'naive-ui'
import { useRoute } from 'vue-router'
import { useAppStore, useChatStore } from '@/store'
import { useBasicLayout } from '@/hooks/useBasicLayout'
import { debounce } from '@/utils/functions/debounce'
import { Agent } from '@/typings/agentChat/Agent'
import newsIcon from '@/assets/news.svg'
import syllabusIcon from '@/assets/syllabus.svg'
import pheonixIcon from '@/assets/pheonix.svg'

const route = useRoute()

const agent = route.params.agent

interface agentPreview {
  agent: Agent
  iconSrc: string
  title: string
}

const { isMobile } = useBasicLayout()

const appStore = useAppStore()
const chatStore = useChatStore()

const agentList: agentPreview[] = [
  { agent: Agent.NEWS_AGENT, iconSrc: newsIcon, title: '薯塔' },
  { agent: Agent.SYLLABUS_AGENT, iconSrc: syllabusIcon, title: '学姐Lora' },
  { agent: Agent.PHEONIX, iconSrc: pheonixIcon, title: '凤凰GPT' },

]

// async function handleSelect({ uuid }: Chat.History) {
//   if (isActive(uuid))
//     return
//
//   if (chatStore.active)
//     chatStore.updateHistory(chatStore.active, { isEdit: false })
//   await chatStore.setActive(uuid)
//
//   if (isMobile.value)
//     appStore.setSiderCollapsed(true)
// }

function handleEdit({ uuid }: Chat.History, isEdit: boolean, event?: MouseEvent) {
  event?.stopPropagation()
  chatStore.updateHistory(uuid, { isEdit })
}

function handleDelete(index: number, event?: MouseEvent | TouchEvent) {
  event?.stopPropagation()
  chatStore.deleteHistory(index)
  if (isMobile.value)
    appStore.setSiderCollapsed(true)
}

const handleDeleteDebounce = debounce(handleDelete, 600)

function handleEnter({ uuid }: Chat.History, isEdit: boolean, event: KeyboardEvent) {
  event?.stopPropagation()
  if (event.key === 'Enter')
    chatStore.updateHistory(uuid, { isEdit })
}

function isActive(curAgent: string) {
  return curAgent === agent
}
</script>

<template>
  <NScrollbar class="px-4">
    <div class="flex flex-col text-sm">
      <!-- <template v-if="!dataSources.length">
        <div class="flex flex-col items-center mt-4 text-center text-neutral-300">
          <SvgIcon icon="ri:inbox-line" class="mb-2 text-3xl" />
          <span>{{ $t('common.noData') }}</span>
        </div>
      </template> -->

      <div v-for="(item, index) of agentList" :key="index">
        <a
          class="relative flex items-center gap-3 px-3 py-3 break-all rounded-md cursor-pointer hover:bg-neutral-100 group dark:border-neutral-800 dark:hover:bg-[#8554ED]"
          :class="isActive(item.agent) && ['bg-neutral-100', 'text-[#8554ED]']"
        >
          <span>
            <img :src="item.iconSrc" alt="logo" />
          </span>
          <div class="relative flex-1 overflow-hidden break-all text-ellipsis whitespace-nowrap">
            <span>{{ item.title }}</span>
          </div>
        </a>
      </div>
      <!--      <div v-for="(item, index) of dataSources" :key="index"> -->
      <!--        <a -->
      <!--          v-if="item.isAgent === true" -->
      <!--          class="relative flex items-center gap-3 px-3 py-3 break-all rounded-md cursor-pointer hover:bg-neutral-100 group dark:border-neutral-800 dark:hover:bg-[#8554ED]" -->
      <!--          :class="isActive(item.uuid) && ['bg-neutral-100', 'text-[#8554ED]']" -->
      <!-- &lt;!&ndash;          @click="handleSelect(item)"&ndash;&gt; -->
      <!--        > -->
      <!--          <span> -->
      <!--            <img v-if="item.uuid === 1111" src="../../../../assets/news.svg" alt="logo" /> -->
      <!--            <img v-if="item.uuid === 2222" src="../../../../assets/syllabus.svg" alt="logo" /> -->
      <!--            <img v-if="item.uuid === 3333" src="../../../../assets/pheonix.svg" alt="logo" /> -->
      <!--          </span> -->
      <!--          <div class="relative flex-1 overflow-hidden break-all text-ellipsis whitespace-nowrap"> -->
      <!--            <span>{{ item.title }}</span> -->
      <!--          </div> -->
      <!--        </a> -->
      <!--      </div> -->
    </div>
  </NScrollbar>
</template>
