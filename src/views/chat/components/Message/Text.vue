<script lang="ts" setup>
import { computed } from 'vue'
import { marked } from 'marked'
import hljs from 'highlight.js'

const props = defineProps<Props>()

marked.setOptions({
  renderer: new marked.Renderer(),
  highlight(code) {
    return hljs.highlightAuto(code).value
  },
})

interface Props {
  inversion?: boolean
  error?: boolean
  text?: string
  loading?: boolean
}

const wrapClass = computed(() => {
  return [
    'text-wrap',
    'p-3',
    'min-w-[20px]',
    'rounded-md',
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
        <div v-if="!inversion" class="markdown-body" v-html="text" />
        <div v-else v-text="text" />
      </div>
    </template>
  </div>
</template>

<style lang="less">
@import url(./style.less);
</style>
