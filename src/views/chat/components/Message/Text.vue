<script lang="ts" setup>
import { computed } from 'vue'
import { marked } from 'marked'
import hljs from 'highlight.js'
import { useBasicLayout } from '@/hooks/useBasicLayout'

interface Props {
  inversion?: boolean
  error?: boolean
  text?: string
  loading?: boolean
}

const props = defineProps<Props>()

const { isMobile } = useBasicLayout()

marked.setOptions({
  renderer: new marked.Renderer(),
  highlight(code) {
    return hljs.highlightAuto(code).value
  },
})

const wrapClass = computed(() => {
  return [
    'text-wrap',
    'min-w-[20px]',
    'rounded-md',
    isMobile.value ? 'p-2' : 'p-3',
    props.inversion ? 'bg-[#d2f9d1]' : 'bg-[#f4f6f8]',
    props.inversion ? 'dark:bg-[#a1dc95]' : 'dark:bg-[#1e1e20]',
    { 'text-red-500': props.error },
  ]
})

const text = computed(() => {
  if (props.text && !props.inversion)
    return marked(props.text)
  return props.text
})
</script>

<template>
  <div class="text-black" :class="wrapClass">
    <template v-if="loading">
      <span class="dark:text-white w-[4px] h-[20px] block animate-blink" />
    </template>
    <template v-else>
      <div class="leading-relaxed break-all">
        <pre v-if="!inversion" class="markdown-body" v-html="text" />
        <div v-else class="whitespace-pre-wrap" v-text="text" />
      </div>
    </template>
  </div>
</template>

<style lang="less">
@import url(./style.less);
</style>
