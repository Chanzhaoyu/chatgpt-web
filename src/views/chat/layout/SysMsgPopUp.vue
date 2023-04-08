<script setup lang='ts'>
import { NAutoComplete, NButton, NInput, NModal, NSlider, useMessage } from 'naive-ui'
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

const chatConfig = computed(() => settingStore.currentChatConfig(+props.uuid))
const temperature = ref(chatConfig.value.temperature)
const top_p = ref(chatConfig.value.top_p)
const systemMessage = ref(chatConfig.value.systemMessage)

const show = computed({
  get: () => props.visible,
  set: (visible: boolean) => {
    updateElements()
    emit('update:visible', visible)
  },
})

function updateChatConfig() {
  settingStore.setChatConfig(+props.uuid, {
    temperature: temperature.value,
    top_p: top_p.value,
    systemMessage: systemMessage.value.trim() ? systemMessage.value.trim() : settingStore.getDefaultSystemMessage,
  })
  ms.success(t('common.success'))
  show.value = false
}

function resetChatConfig() {
  settingStore.restoreDefaultChatConfig(+props.uuid)
  ms.success(t('common.success'))
  show.value = false
}

function updateElements() {
  temperature.value = chatConfig.value.temperature
  top_p.value = chatConfig.value.top_p
  systemMessage.value = chatConfig.value.systemMessage
}

const searchOptions = computed(() => {
  if (systemMessage.value.startsWith('/')) {
    const { promptList: promptTemplate } = promptStore.getPromptList()
    return promptTemplate.filter((item: { key: string }) => item.key.toLowerCase().includes(systemMessage.value.substring(1).toLowerCase())).map((obj: { value: any }) => {
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
    <div class="space-y-6">
      <div class="flex items-center space-x-4">
        <span class="flex-shrink-0 w-[120px]">{{ $t('setting.role') }}</span>
        <NAutoComplete v-model:value="systemMessage" :options="searchOptions" :render-label="renderOption">
          <template #default="{ handleInput, handleBlur, handleFocus }">
            <NInput
              v-model:value="systemMessage"
              type="textarea"
              rows="6"
              :placeholder="t('systemMessage.inputPrompt')"
              @input="handleInput"
              @focus="handleFocus"
              @blur="handleBlur"
            />
          </template>
        </NAutoComplete>
      </div>
      <div class="flex items-center space-x-4">
        <span class="flex-shrink-0 w-[120px]">{{ $t('setting.temperature') }}</span>
        <div class="flex-1">
          <NSlider v-model:value="temperature" :max="1" :min="0" :step="0.1" />
        </div>
        <span>{{ temperature }}</span>
      </div>
      <div class="flex items-center space-x-4">
        <span class="flex-shrink-0 w-[120px]">{{ $t('setting.top_p') }}</span>
        <div class="flex-1">
          <NSlider v-model:value="top_p" :max="1" :min="0" :step="0.1" />
        </div>
        <span>{{ top_p }}</span>
      </div>
      <NButton style="margin-right: 20px" type="primary" @click="updateChatConfig">
        {{ $t('common.save') }}
      </NButton>

      <NButton @click="resetChatConfig">
        {{ $t('common.reset') }}
      </NButton>
    </div>
  </NModal>
</template>
