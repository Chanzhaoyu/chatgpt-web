<script setup lang='ts'>
import { ref, watch } from 'vue'
import { NButton, NLayoutSider } from 'naive-ui'
import List from './List.vue'
import Footer from './Footer.vue'

interface Props {
  collapsed?: boolean
}

interface Emit {
  (e: 'update:collapsed', value: boolean): void
}

const props = withDefaults(defineProps<Props>(), {
  collapsed: false,
})

const emit = defineEmits<Emit>()

const collapsed = ref(props.collapsed)

watch(
  () => props.collapsed,
  (value: boolean) => {
    collapsed.value = value
  },
  { immediate: true },
)

function handleCollapsed() {
  collapsed.value = !collapsed.value
  emit('update:collapsed', collapsed.value)
}
</script>

<template>
  <NLayoutSider
    :collapsed="collapsed"
    :collapsed-width="0"
    :width="260"
    collapse-mode="width"
    show-trigger="arrow-circle"
    bordered
    @update:collapsed="handleCollapsed"
  >
    <div class="flex flex-col h-full">
      <main class="flex-1 min-h-0 overflow-hidden">
        <div class="p-4">
          <NButton dashed block>
            Add chat
          </NButton>
        </div>
        <List />
      </main>
      <Footer />
    </div>
  </NLayoutSider>
</template>
