<script lang="ts" setup>
import { computed, ref } from 'vue'
import { NButton, NInput, NModal, NSpace, useMessage } from 'naive-ui'
import { t } from '@/locales'
import { fetchUpdateChatRoomPrompt } from '@/api'
import { useChatStore } from '@/store'

const props = defineProps<Props>()
const emit = defineEmits<Emit>()

const chatStore = useChatStore()
const currentChatHistory = computed(() => chatStore.getChatHistoryByCurrentActive)
const ms = useMessage()
const testing = ref(false)
const title = `Prompt For [${currentChatHistory.value?.title}]`

interface Props {
  visible: boolean
  roomId: string
}

interface Emit {
  (e: 'update:visible', visible: boolean): void
}

const show = computed({
  get() {
    return props.visible
  },
  set(visible: boolean) {
    emit('update:visible', visible)
  },
})

async function handleSaveChatRoomPrompt() {
  if (!currentChatHistory.value || !currentChatHistory.value)
    return

  testing.value = true
  try {
    const { message } = await fetchUpdateChatRoomPrompt(currentChatHistory.value.prompt ?? '', +props.roomId) as { status: string; message: string }
    ms.success(message)
    show.value = false
  }
  catch (error: any) {
    ms.error(error.message)
  }
  testing.value = false
}
</script>

<template>
  <NModal
    v-model:show="show" :auto-focus="false" class="custom-card" preset="card" :style="{ width: '600px' }" :title="title" size="huge"
    :bordered="false"
  >
    <!-- <template #header-extra>
      噢!
    </template> -->
    <NInput
      :value="currentChatHistory && currentChatHistory.prompt"
      type="textarea"
      :autosize="{ minRows: 4, maxRows: 10 }" placeholder="Prompt for this room, If empty will use Settings ->  Advanced -> Role" @input="(val) => { if (currentChatHistory) currentChatHistory.prompt = val }"
    />
    <template #footer>
      <NSpace justify="end">
        <NButton :loading="testing" type="success" @click="handleSaveChatRoomPrompt">
          {{ t('common.save') }}
        </NButton>
      </NSpace>
    </template>
  </NModal>
</template>
