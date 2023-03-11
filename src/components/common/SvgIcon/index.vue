<script setup lang='ts'>
import { computed, useAttrs } from 'vue'
import { Icon, addAPIProvider } from '@iconify/vue'

interface Props {
  icon?: string
}

defineProps<Props>()

const attrs = useAttrs()

const bindAttrs = computed<{ class: string; style: string }>(() => ({
  class: (attrs.class as string) || '',
  style: (attrs.style as string) || '',
}))
addAPIProvider('qyt', {
  // Array of host names
  resources: ['https://iconify.qyt.com'],
})
</script>

<template>
  <Icon :icon="`@qyt:${icon}`" v-bind="bindAttrs" />
</template>
