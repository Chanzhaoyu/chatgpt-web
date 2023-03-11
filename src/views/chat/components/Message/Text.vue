<script lang="ts" setup>
import { computed, ref } from 'vue'
import MarkdownIt from 'markdown-it'
import mdKatex from '@traptitech/markdown-it-katex'
import hljs from 'highlight.js'
import { NButton, NInput } from 'naive-ui'
import { useBasicLayout } from '@/hooks/useBasicLayout'
import { t } from '@/locales'

interface Props {
  inversion?: boolean
  error?: boolean
  text?: string
  loading?: boolean
  edit?: boolean
}

interface Emit {
  (e: 'update:text', text: string): void
  (e: 'editSubmit', text: string): void
  (ev: 'editCancel'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emit>()

const { isMobile } = useBasicLayout()

const textRef = ref<HTMLElement>()

const mdi = new MarkdownIt({
  linkify: true,
  highlight(code, language) {
    const validLang = !!(language && hljs.getLanguage(language))
    if (validLang) {
      const lang = language ?? ''
      return highlightBlock(hljs.highlight(lang, code, true).value, lang)
    }
    return highlightBlock(hljs.highlightAuto(code).value, '')
  },
})

mdi.use(mdKatex, { blockClass: 'katexmath-block rounded-md p-[10px]', errorColor: ' #cc0000' })

const wrapClass = computed(() => {
  return [
    'text-wrap',
    'min-w-[20px]',
    'rounded-md',
    isMobile.value ? 'p-2' : 'px-3 py-2',
    props.inversion ? 'bg-[#d2f9d1]' : 'bg-[#f4f6f8]',
    props.inversion ? 'dark:bg-[#a1dc95]' : 'dark:bg-[#1e1e20]',
    { 'text-red-500': props.error },
  ]
})

const text = computed(() => {
  const value = props.text ?? ''
  if (!props.inversion)
    return mdi.render(value)
  return value
})

function handleSubmit() {
  emit('editSubmit', text.value)
}

function handleCancel() {
  emit('editCancel')
}

function handleInput(v: string) {
  emit('update:text', v)
}

function highlightBlock(str: string, lang?: string) {
  return `<pre class="code-block-wrapper"><div class="code-block-header"><span class="code-block-header__lang">${lang}</span><span class="code-block-header__copy">${t('chat.copyCode')}</span></div><code class="hljs code-block-body ${lang}">${str}</code></pre>`
}

defineExpose({ textRef })
</script>

<template>
  <div class="text-black" :class="wrapClass">
    <template v-if="loading">
      <span class="dark:text-white w-[4px] h-[20px] block animate-blink" />
    </template>
    <template v-else>
      <div ref="textRef" class="leading-relaxed break-words">
        <template v-if="edit">
          <div class="whitespace-pre-wrap">
            <NInput
              :value="text"
              type="textarea"
              :autosize="{ minRows: 5 }"
              @input="handleInput"
            />
            <div class="chat-edit-buttons">
              <NButton type="primary" @click="handleSubmit">
                {{ t('chat.saveAndSubmit') }}
              </NButton>
              <NButton @click="handleCancel">
                {{ t('chat.cancel') }}
              </NButton>
            </div>
          </div>
        </template>
        <template v-else>
          <div v-if="!inversion" class="markdown-body" v-html="text" />
          <div v-else class="whitespace-pre-wrap" v-text="text" />
        </template>
      </div>
    </template>
  </div>
</template>

<style lang="less">
@import url(./style.less);
</style>
