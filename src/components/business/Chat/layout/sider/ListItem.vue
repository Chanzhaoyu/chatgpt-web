<script setup lang='ts'>
import { SvgIcon } from '@/components/common'

interface Props {
  text: string
}

interface Emit {
  (e: 'click',): void
  (e: 'edit',): void
  (e: 'delete',): void
}

defineProps<Props>()

const emit = defineEmits<Emit>()

function handleClick(event: Event) {
  emit('click')
  event.preventDefault()
}

function handleEdit() {
  emit('edit')
}

function handleDelete() {
  emit('delete')
}
</script>

<template>
  <a
    class="relative flex items-center gap-3 px-3 py-3 break-all rounded-md cursor-pointer bg-neutral-50 pr-14 hover:bg-neutral-100 group"
    @click="handleClick"
  >
    <span>
      <SvgIcon icon="ri:message-3-line" />
    </span>
    <div class="relative flex-1 overflow-hidden break-all text-ellipsis whitespace-nowrap max-h-5">
      <span>{{ text }}</span>
    </div>
    <div class="absolute z-10 flex visible right-1">
      <button class="p-1" @click="handleEdit">
        <SvgIcon icon="ri:edit-line" />
      </button>
      <button class="p-1" @click="handleDelete">
        <SvgIcon icon="ri:delete-bin-line" />
      </button>
    </div>
  </a>
</template>
