<script lang="ts" setup>
import { computed, ref } from 'vue'
import { NButton, NInput, NPopconfirm, useMessage } from 'naive-ui'
import type { Language, Theme } from '@/store/modules/app/helper'
import { SvgIcon } from '@/components/common'
import { useAppStore, useUserStore } from '@/store'
import type { UserInfo } from '@/store/modules/user/helper'
import { t } from '@/locales'

interface Emit {
  (event: 'update'): void
}

const emit = defineEmits<Emit>()

const appStore = useAppStore()
const userStore = useUserStore()

const ms = useMessage()

const theme = computed(() => appStore.theme)

const userInfo = computed(() => userStore.userInfo)

const avatar = ref(userInfo.value.avatar ?? '')

const name = ref(userInfo.value.name ?? '')

const description = ref(userInfo.value.description ?? '')

const language = computed({
  get() {
    return appStore.language
  },
  set(value: Language) {
    appStore.setLanguage(value)
  },
})

const themeOptions: { label: string; key: Theme; icon: string }[] = [
  {
    label: 'Auto',
    key: 'auto',
    icon: 'ri:contrast-line',
  },
  {
    label: 'Light',
    key: 'light',
    icon: 'ri:sun-foggy-line',
  },
  {
    label: 'Dark',
    key: 'dark',
    icon: 'ri:moon-foggy-line',
  },
]

const languageOptions: { label: string; key: Language; value: Language }[] = [
  { label: '中文', key: 'zh-CN', value: 'zh-CN' },
  { label: 'English', key: 'en-US', value: 'en-US' },
]

function updateUserInfo(options: Partial<UserInfo>) {
  userStore.updateUserInfo(options)
  ms.success(t('common.success'))
}

function handleReset() {
  userStore.resetUserInfo()
  ms.success(t('common.success'))
  emit('update')
}

function exportData(): void {
  const data: string = localStorage.getItem('chatStorage') || '{}'

  const jsonString: string = JSON.stringify(JSON.parse(data), null, 2)

  const blob: Blob = new Blob([jsonString], { type: 'application/json' })
  const url: string = URL.createObjectURL(blob)
  const link: HTMLAnchorElement = document.createElement('a')
  link.href = url
  link.download = 'chat-store.json'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

function importData(event: Event): void {
  const target = event.target as HTMLInputElement
  if (!target || !target.files)
    return

  const file: File = target.files[0]
  if (!file)
    return

  const reader: FileReader = new FileReader()
  reader.onload = () => {
    try {
      const data = JSON.parse(reader.result as string)
      localStorage.setItem('chatStorage', JSON.stringify(data))
      ms.success(t('common.success'))
      emit('update')
      location.reload()
    }
    catch (error) {
      ms.error(t('common.invalidFileFormat'))
    }
  }
  reader.readAsText(file)
}

function clearData(): void {
  localStorage.removeItem('chatStorage')
  location.reload()
}

function handleImportButtonClick(): void {
  const fileInput = document.getElementById('fileInput') as HTMLElement
  if (fileInput)
    fileInput.click()
}
</script>

<template>
  <div class="p-4 space-y-5 min-h-[200px]">
    <div class="space-y-6">
      <div class="flex items-center space-x-4">
        <span class="flex-shrink-0 w-[100px]">{{ $t('setting.avatarLink') }}</span>
        <div class="flex-1">
          <NInput v-model:value="avatar" placeholder="" />
        </div>
        <NButton size="tiny" text type="primary" @click="updateUserInfo({ avatar })">
          {{ $t('common.save') }}
        </NButton>
      </div>
      <div class="flex items-center space-x-4">
        <span class="flex-shrink-0 w-[100px]">{{ $t('setting.name') }}</span>
        <div class="w-[200px]">
          <NInput v-model:value="name" placeholder="" />
        </div>
        <NButton size="tiny" text type="primary" @click="updateUserInfo({ name })">
          {{ $t('common.save') }}
        </NButton>
      </div>
      <div class="flex items-center space-x-4">
        <span class="flex-shrink-0 w-[100px]">{{ $t('setting.description') }}</span>
        <div class="flex-1">
          <NInput v-model:value="description" placeholder="" />
        </div>
        <NButton size="tiny" text type="primary" @click="updateUserInfo({ description })">
          {{ $t('common.save') }}
        </NButton>
      </div>
      <div class="flex items-center space-x-4">
        <span class="flex-shrink-0 w-[100px]">{{ $t('setting.resetUserInfo') }}</span>
        <NButton text type="primary" @click="handleReset">
          {{ $t('common.reset') }}
        </NButton>
      </div>
      <div class="flex items-center space-x-4">
        <span class="flex-shrink-0 w-[100px]">{{ $t('setting.chatHistory') }}</span>
        <NButton text type="primary" @click="exportData">
          {{ $t('common.export') }}
        </NButton>

        <input id="fileInput" type="file" style="display:none" @change="importData">
        <NButton text type="primary" @click="handleImportButtonClick">
          {{ $t('common.import') }}
        </NButton>

        <NPopconfirm placement="bottom" @positive-click="clearData">
          <template #trigger>
            <NButton text type="primary">
              {{ $t('common.clear') }}
            </NButton>
          </template>
          {{ $t('chat.clearHistoryConfirm') }}
        </NPopconfirm>
      </div>
      <div class="flex items-center space-x-4">
        <span class="flex-shrink-0 w-[100px]">{{ $t('setting.theme') }}</span>
        <div class="flex items-center space-x-4">
          <template v-for="item of themeOptions" :key="item.key">
            <a
              class="flex items-center justify-center h-8 px-4 border rounded-md cursor-pointer dark:border-neutral-700"
              :class="item.key === theme && ['bg-[#4ca85e]', 'border-[#4ca85e]', 'text-white']"
              @click="appStore.setTheme(item.key)"
            >
              <span class="text-xl">
                <SvgIcon :icon="item.icon" />
              </span>
            </a>
          </template>
        </div>
      </div>
      <div class="flex items-center space-x-4">
        <span class="flex-shrink-0 w-[100px]">{{ $t('setting.language') }}</span>
        <div class="flex items-center space-x-4">
          <template v-for="item of languageOptions" :key="item.key">
            <a
              class="flex items-center justify-center h-8 px-4 border rounded-md cursor-pointer dark:border-neutral-700"
              :class="item.key === language && ['bg-[#4ca85e]', 'border-[#4ca85e]', 'text-white']"
              @click="appStore.setLanguage(item.key)"
            >
              <span class="text-sm">
                {{ item.label }}
              </span>
            </a>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>
