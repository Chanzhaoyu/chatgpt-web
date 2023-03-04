<script lang="ts" setup>
import { computed, ref } from 'vue'
import katex from 'katex'
import { marked } from 'marked'
import hljs from 'highlight.js'
import { useBasicLayout } from '@/hooks/useBasicLayout'
import { encodeHTML } from '@/utils/format'
import { t } from '@/locales'

interface Props {
  inversion?: boolean
  error?: boolean
  text?: string
  loading?: boolean
}

const props = defineProps<Props>()

const { isMobile } = useBasicLayout()

const renderer = new marked.Renderer()

const textRef = ref<HTMLElement>()

renderer.html = (html) => {
  return `<p>${encodeHTML(html)}</p>`
}

renderer.code = (code, language) => {
  const validLang = !!(language && hljs.getLanguage(language))
  if (validLang) {
    const lang = language ?? ''
    return `<pre class="code-block-wrapper"><div class="code-block-header"><span class="code-block-header__lang">${lang}</span><span class="code-block-header__copy">${t('chat.copyCode')}</span></div><code class="hljs code-block-body ${language}">${hljs.highlight(code, { language: lang }).value}</code></pre>`
  }
  return `<pre style="background: none">${hljs.highlightAuto(code).value}</pre>`
}

marked.setOptions({
  renderer,
  highlight(code) {
    return hljs.highlightAuto(code).value
  },
})

const katexOptions = {
  throwOnError: false,
}

const katexInline = {
  name: 'katexInline',
  level: 'inline',
  start(src: string) {
    return src.indexOf('$')
  },
  tokenizer(src: string) {
    const match = src.match(/^\$+([^$\n]+?)\$+/)
    if (match) {
      return {
        type: 'katexInline',
        raw: match[0],
        text: match[1].trim(),
      }
    }
  },
  renderer(token: marked.Tokens.Generic) {
    return katex.renderToString(token.text, katexOptions)
  },
}

const katexBlock = {
  name: 'katexBlock',
  level: 'block',
  start(src: string) {
    return src.indexOf('\n$$')
  },
  tokenizer(src: string) {
    const match = src.match(/^\$\$+\n([^$]+?)\n\$\$+\n/)
    if (match) {
      return {
        type: 'katexBlock',
        raw: match[0],
        text: match[1].trim(),
      }
    }
  },
  renderer(token: marked.Tokens.Generic) {
    return `<p>${katex.renderToString(token.text, katexOptions)}</p>`
  },
}

marked.use({ extensions: [katexInline, katexBlock] })

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
  const value = props.text ?? ''
  if (!props.inversion)
    return marked(value)
  return value
})

defineExpose({ textRef })
</script>

<template>
  <div class="text-black" :class="wrapClass">
    <template v-if="loading">
      <span class="dark:text-white w-[4px] h-[20px] block animate-blink" />
    </template>
    <template v-else>
      <div ref="textRef" class="leading-relaxed break-words">
        <div v-if="!inversion" class="markdown-body" v-html="text" />
        <div v-else class="whitespace-pre-wrap" v-text="text" />
      </div>
    </template>
  </div>
</template>

<style lang="less">
@import url(./style.less);
</style>
