<!-- eslint-disable no-console -->
<script setup lang='ts'>
import { computed } from 'vue'
import { NScrollbar } from 'naive-ui'
import { useAppStore, useChatStore } from '@/store'
import { useBasicLayout } from '@/hooks/useBasicLayout'
import { debounce } from '@/utils/functions/debounce'
const { isMobile } = useBasicLayout()

const appStore = useAppStore()
const chatStore = useChatStore()

const dataSources = computed(() => [{ title: '薯塔', uuid: '1111', isEdit: false }, { title: '学姐Dora', uuid: '2222', isEdit: false }])

async function handleSelect({ uuid }: Chat.History) {
  if (isActive(uuid))
    return

  if (chatStore.active)
    chatStore.updateHistory(chatStore.active, { isEdit: false })
  await chatStore.setActive(uuid)

  if (isMobile.value)
    appStore.setSiderCollapsed(true)
}

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

function isActive(uuid: number) {
  return chatStore.active === uuid
}
</script>

<template>
  <NScrollbar class="px-4">
    <div class="flex flex-col gap-2 text-sm">
      <!-- <template v-if="!dataSources.length">
        <div class="flex flex-col items-center mt-4 text-center text-neutral-300">
          <SvgIcon icon="ri:inbox-line" class="mb-2 text-3xl" />
          <span>{{ $t('common.noData') }}</span>
        </div>
      </template> -->
      <div v-for="(item, index) of dataSources" :key="index">
        <a
          class="relative flex items-center gap-3 px-3 py-3 break-all rounded-md cursor-pointer hover:bg-neutral-100 group dark:border-neutral-800 dark:hover:bg-[#8554ED]"
          :class="isActive(item.uuid) && ['bg-neutral-100', 'text-[#8554ED]']"
          @click="handleSelect(item)"
        >
          <span>
            <img v-if="item.uuid === '1111'" src="@/assets/Ellipse 276.svg" alt="logo" />
            <img v-if="item.uuid === '2222'" src="@/assets/Ellipse 277.svg" alt="logo" />
          </span>
          <div class="relative flex-1 overflow-hidden break-all text-ellipsis whitespace-nowrap">
            <span>{{ item.title }}</span>
          </div>
        </a>
      </div>
    </div>
  </NScrollbar>
</template>
