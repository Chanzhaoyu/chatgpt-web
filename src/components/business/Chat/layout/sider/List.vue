<script setup lang='ts'>
import { NScrollbar } from 'naive-ui'
import type { HistoryChatProps } from '../../types'
import { SvgIcon } from '@/components/common'

interface Props {
  data: HistoryChatProps[]
}

interface Emit {
  (ev: 'delete', index: number): void
  (ev: 'edit', index: number): void
}

defineProps<Props>()

const emit = defineEmits<Emit>()

function handleEdit(index: number) {
  emit('delete', index)
}

function handleDelete(index: number) {
  emit('delete', index)
}
</script>

<template>
  <NScrollbar class="px-4">
    <div class="flex flex-col gap-2 text-sm">
      <div v-for="(item, index) of data" :key="index">
        <a
          class="relative flex items-center gap-3 px-3 py-3 break-all rounded-md cursor-pointer bg-neutral-50 pr-14 hover:bg-neutral-100 group"
        >
          <span>
            <SvgIcon icon="ri:message-3-line" />
          </span>
          <div class="relative flex-1 overflow-hidden break-all text-ellipsis whitespace-nowrap max-h-5">
            <span>{{ item.title }}</span>
          </div>
          <div class="absolute z-10 flex visible right-1">
            <button class="p-1">
              <SvgIcon icon="ri:edit-line" @click="handleEdit(index)" />
            </button>
            <button class="p-1" @click="handleDelete(index)">
              <SvgIcon icon="ri:delete-bin-line" />
            </button>
          </div>
        </a>
      </div>
    </div>
  </NScrollbar>
</template>
