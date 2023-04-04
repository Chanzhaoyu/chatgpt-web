<script setup lang='ts'>
import { NAutoComplete, NButton, NInput, NModal, NSpace, useMessage } from 'naive-ui'
import { computed, ref } from 'vue'
import { usePromptStore, useSettingStore } from '@/store'
import { t } from '@/locales'

interface Props {
  visible: boolean
  uuid: string
}

interface PromptItem {
  key: string
  value: string
}

interface Emit {
  (e: 'update:visible', visible: boolean): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emit>()

const promptStore = usePromptStore()
const settingStore = useSettingStore()
const ms = useMessage()
const tempSystemMessage = ref(settingStore.currentSystemMessage(+props.uuid))
const defaultSystemMessage = computed(() => settingStore.defaultSystemMessage)
const loading = ref(false)
const disabled = computed (() => loading.value)
const show = computed({
  get: () => props.visible,
  set: (visible: boolean) => emit('update:visible', visible),
})

function setSystemMessage() {
  const message = tempSystemMessage.value.trim()
  try {
    loading.value = true
    if (message.length > 1) {
      settingStore.setCurrentSystemMessage(+props.uuid, message)
      ms.success(t('common.success'))
      show.value = false
    }
    else {
      settingStore.restoreDefaultSystemMessage(+props.uuid)
      tempSystemMessage.value = defaultSystemMessage.value
      ms.success(t('systemMessage.reset'))
      show.value = false
    }
  }
  catch (error) {
    ms.error(t('common.wrong'))
  }
  finally {
    loading.value = false
  }
}

function handlePress(event: KeyboardEvent) {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault()
    setSystemMessage()
  }
}

const searchOptions = computed(() => {
  if (tempSystemMessage.value.startsWith('/')) {
    const { promptList: promptTemplate } = promptStore.getPromptList()
    return promptTemplate.filter((item: { key: string }) => item.key.toLowerCase().includes(tempSystemMessage.value.substring(1).toLowerCase())).map((obj: { value: any }) => {
      return {
        label: obj.value,
        value: obj.value,
      }
    })
  }
  else {
    return []
  }
})

// value反渲染key
const renderOption = (option: { label: string }) => {
  const { promptList: promptTemplate } = promptStore.getPromptList()
  for (const i of promptTemplate as PromptItem[]) {
    if (i.value === option.label)
      return [i.key]
  }
  return []
}
</script>

<template>
  <NModal v-model:show="show" style="width: 90%; max-width: 600px;" preset="card">
    <div class="w-full max-w-screen-xl m-auto">
      <NSpace vertical>
        <span class="font-bold text-lg">{{ $t('systemMessage.chatRole') }}</span>
        <NAutoComplete v-model:value="tempSystemMessage" :options="searchOptions" :render-label="renderOption">
          <template #default="{ handleInput, handleBlur, handleFocus }">
            <NInput
              v-model:value="tempSystemMessage"
              type="textarea"
              rows="6"
              :placeholder="t('systemMessage.inputPrompt')"
              @input="handleInput"
              @focus="handleFocus"
              @blur="handleBlur"
              @keypress="handlePress"
            />
          </template>
        </NAutoComplete>
      </NSpace>
      <div class="my-4" />
      <NSpace vertical>
        <span class="font-bold text-lg">{{ $t('systemMessage.defaultRole') }}</span>
        <NInput
          v-model:value="defaultSystemMessage"
          type="textarea"
          rows="6"
          :disabled="true"
        />
      </NSpace>
      <NButton
        block
        type="primary"
        :disabled="disabled"
        :loading="loading"
        @click="setSystemMessage"
      >
        {{ $t('common.save') }}
      </NButton>
    </div>
  </NModal>
</template>
