<script lang="ts" setup>
import { NDropdown } from 'naive-ui'
import { computed, h } from 'vue'
import { marked } from 'marked'
import includeCode from '@/utils/functions/includeCode'
import { SvgIcon } from '@/components/common'

interface Props {
  inversion?: boolean
  error?: boolean
  text?: string
  loading?: boolean
}

interface Emit {
  (ev: 'copy'): void
  (ev: 'delete'): void
}

const props = defineProps<Props>()

const emit = defineEmits<Emit>()

const options = [
  {
    label: 'Copy',
    key: 'copy',
    icon: renderIcon('ri:file-copy-2-line'),
  },
  {
    label: 'Delete',
    key: 'delete',
    icon: renderIcon('ri:delete-bin-6-line'),
  },
]

function renderIcon(icon: string) {
  return () => {
    return h(SvgIcon, { icon })
  }
}

function handleSelect(key: string | number) {
  switch (key) {
    case 'copy':
      emit('copy')
      break
    case 'delete':
      emit('delete')
      break
  }
}

const wrapClass = computed(() => {
  return [
    'text-wrap',
    'p-3',
    'min-w-[20px]',
    'rounded-md',
    props.inversion ? 'bg-[#d2f9d1]' : 'bg-[#f4f6f8]',
    { 'text-red-500': props.error },
  ]
})

const text = computed(() => {
  if (props.text) {
    if (!includeCode(props.text))
      return marked.parse(props.text)
    return props.text
  }
  return ''
})
</script>

<template>
  <NDropdown trigger="click" :options="options" @select="handleSelect">
    <div :class="wrapClass">
      <template v-if="loading">
        <span class="w-[5px] h-[20px] block animate-blink" />
      </template>
      <template v-else>
        <code v-if="includeCode(text)" v-highlight class="leading-relaxed" v-text="text" />
        <div v-else class="leading-relaxed break-all" v-html="text" />
      </template>
    </div>
  </NDropdown>
</template>

<style lang="less">
.text-wrap{
  img{
    max-width: 100%;
    vertical-align: middle;
  }
  a {
    color: #2d5cf6
  }
}

.hljs {
  background-color: #fff0 !important;
  white-space: break-spaces;
}
</style>
