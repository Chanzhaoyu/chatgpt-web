<script lang="ts" setup>
import { computed } from 'vue'
import { marked } from 'marked'
import includeCode from '@/utils/functions/includeCode'

interface Props {
  inversion?: boolean
  error?: boolean
  text?: string
  loading?: boolean
}

const props = defineProps<Props>()

const wrapClass = computed(() => {
  return [
    'text-wrap',
    'p-2',
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
  <div :class="wrapClass">
    <template v-if="loading">
      <span class="w-[3px] h-[20px] block animate-blink" />
    </template>
    <template v-else>
      <code v-if="includeCode(text)" v-highlight class="leading-relaxed" v-text="text" />
      <div v-else class="leading-relaxed break-all" v-html="text" />
    </template>
  </div>
</template>

<style lang="less">
.text-wrap{
  img{
    max-width: 100%;
    vertical-align: middle;
  }
}

.hljs {
  background-color: #fff0 !important;
  white-space: break-spaces;
}
</style>
