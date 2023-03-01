<script setup lang='ts'>
import { NDropdown, useMessage } from 'naive-ui'
import AvatarComponent from './Avatar.vue'
import TextComponent from './Text.vue'
import { SvgIcon } from '@/components/common'
import { copyText } from '@/utils/format'
import { useIconRender } from '@/hooks/useIconRender'

interface Props {
  dateTime?: string
  text?: string
  inversion?: boolean
  error?: boolean
  loading?: boolean
}

interface Emit {
  (ev: 'regenerate'): void
  (ev: 'delete'): void
}

const props = defineProps<Props>()

const emit = defineEmits<Emit>()

const ms = useMessage()

const { iconRender } = useIconRender()

const options = [
  {
    label: 'Copy',
    key: 'copy',
    icon: iconRender({ icon: 'ri:file-copy-2-line' }),
  }, {
    label: 'Delete',
    key: 'delete',
    icon: iconRender({ icon: 'ri:delete-bin-line' }),
  },
]

function handleSelect(key: 'copy' | 'delete') {
  if (key === 'copy')
    handleCopy()
  else
    handleDelete()
}

function handleDelete() {
  emit('delete')
}

function handleCopy() {
  copyText(props.text ?? '')
  ms.success('Copied')
}

function handleRegenerate() {
  emit('regenerate')
}
</script>

<template>
  <div class="flex w-full mb-6 overflow-hidden" :class="[{ 'flex-row-reverse': inversion }]">
    <div
      class="flex items-center justify-center flex-shrink-0 h-8 overflow-hidden rounded-full basis-8"
      :class="[inversion ? 'ml-2' : 'mr-2']"
    >
      <AvatarComponent :image="inversion" />
    </div>
    <div class="overflow-hidden text-sm " :class="[inversion ? 'items-end' : 'items-start']">
      <p class="text-xs text-[#b4bbc4]" :class="[inversion ? 'text-right' : 'text-left']">
        {{ dateTime }}
      </p>
      <div
        class="flex items-end gap-2 mt-2"
        :class="[inversion ? 'flex-row-reverse' : 'flex-row']"
      >
        <TextComponent
          :inversion="inversion"
          :error="error"
          :text="text"
          :loading="loading"
        />
        <div class="flex flex-col">
          <button
            v-if="!inversion"
            class="mb-2 transition text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200"
            @click="handleRegenerate"
          >
            <SvgIcon icon="ri:restart-line" />
          </button>
          <NDropdown :options="options" @select="handleSelect">
            <button class="transition text-neutral-300 hover:text-neutral-800 dark:hover:text-neutral-200">
              <SvgIcon icon="ri:function-line" />
            </button>
          </NDropdown>
        </div>
      </div>
    </div>
  </div>
</template>
