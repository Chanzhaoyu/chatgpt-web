<script setup lang='ts'>
import { ref } from 'vue'
import { NInput, NScrollbar } from 'naive-ui'
import { SvgIcon } from '@/components/common'
import { useHistoryStore } from '@/store'

const historyStore = useHistoryStore()

const dataSources = ref(historyStore.historyChat)

function handleSelect(index: number) {
  historyStore.chooseHistory(index)
}

function handleEdit(index: number, isEdit: boolean) {
  historyStore.editHistory(index, isEdit)
}

function handleRemove(index: number) {
  historyStore.removeHistory(index)
}

function handleEnter(index: number, isEdit: boolean, event: KeyboardEvent) {
  if (event.key === 'Enter')
    handleEdit(index, isEdit)
}
</script>

<template>
  <NScrollbar class="px-4">
    <div class="flex flex-col gap-2 text-sm">
      <div v-for="(item, index) of dataSources" :key="index">
        <a
          class="relative flex items-center gap-3 px-3 py-3 break-all rounded-md cursor-pointer bg-neutral-50 pr-14 hover:bg-neutral-100 group"
          @click="handleSelect(index)"
        >
          <span :class="[{ 'text-[#4b9e5f]': historyStore.active === index }]">
            <SvgIcon icon="ri:message-3-line" />
          </span>
          <div class="relative flex-1 overflow-hidden break-all text-ellipsis whitespace-nowrap">
            <NInput
              v-if="item.isEdit" v-model:value="item.title" size="tiny"
              @keypress="handleEnter(index, false, $event)"
            />
            <span v-else>{{ item.title }}</span>
          </div>
          <div class="absolute z-10 flex visible right-1">
            <template v-if="item.isEdit">
              <button class="p-1" @click="handleEdit(index, false)">
                <SvgIcon icon="ri:save-line" />
              </button>
            </template>
            <template v-else>
              <button class="p-1">
                <SvgIcon icon="ri:edit-line" @click="handleEdit(index, true)" />
              </button>
              <button class="p-1" @click="handleRemove(index)">
                <SvgIcon icon="ri:delete-bin-line" />
              </button>
            </template>
          </div>
        </a>
      </div>
    </div>
  </NScrollbar>
</template>
