<script setup lang="ts">
import { defineComponent, h } from 'vue'
import { NMessageProvider, useMessage } from 'naive-ui'

function registerNaiveTools() {
  window.$message = useMessage()
}

const NaiveProviderContent = defineComponent({
  name: 'NaiveProviderContent',
  setup() {
    registerNaiveTools()
  },
  render() {
    return h('div')
  },
})
</script>

<template>
  <NMessageProvider>
    <slot />
    <NaiveProviderContent />
  </NMessageProvider>
</template>
