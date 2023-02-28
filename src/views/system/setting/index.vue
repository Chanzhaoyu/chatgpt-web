<script setup lang='ts'>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { NButton, NSelect, useDialog } from 'naive-ui'
import type { Language, Theme } from '@/store/modules/app/helper'
import { SvgIcon } from '@/components/common'
import { useAppStore } from '@/store'

const router = useRouter()
const dialog = useDialog()
const appStore = useAppStore()

const theme = computed(() => appStore.theme)

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
    label: 'Dark',
    key: 'dark',
    icon: 'ri:moon-foggy-line',
  },
  {
    label: 'Light',
    key: 'light',
    icon: 'ri:sun-foggy-line',
  },
  {
    label: 'Auto',
    key: 'auto',
    icon: 'ri:contrast-line',
  },
]

const languageOptions: { label: string; value: Language }[] = [
  { label: '中文', value: 'zh-CN' },
  { label: 'English', value: 'en-US' },
]

function handleTheme(theme: Theme) {
  appStore.setTheme(theme)
}

function handleLogout() {
  dialog.warning({
    title: '退出登录',
    content: '确定退出登录吗？',
    positiveText: '是',
    negativeText: '否',
    onPositiveClick: () => {
      router.push({ name: 'Login' })
    },
  })
}
</script>

<template>
  <div class="container m-auto">
    <div class="p-4">
      <h2 class="py-6 mb-4 text-2xl font-bold">
        设置
      </h2>
      <div class="space-y-8">
        <div class="flex items-center space-x-4">
          <span>主题</span>
          <div class="flex items-center flex-auto space-x-4">
            <template v-for="item of themeOptions" :key="item.key">
              <a
                class="flex items-center justify-center w-20 h-10 border rounded-md cursor-pointer dark:border-neutral-800"
                :class="item.key === theme && ['bg-[#4ca85e]', 'border-[#4ca85e]', 'text-white']"
                @click="handleTheme(item.key)"
              >
                <span class="text-xl">
                  <SvgIcon :icon="item.icon" />
                </span>
              </a>
            </template>
          </div>
        </div>
        <div class="flex items-center space-x-4">
          <span class="">语言</span>
          <div class="w-[200px]">
            <NSelect v-model:value="language" :options="languageOptions" />
          </div>
        </div>
        <div class="flex items-center space-x-4">
          <span class="">其他</span>
          <div @click="handleLogout">
            <NButton type="primary" text>
              清除缓存
            </NButton>
          </div>
        </div>
        <div class="flex items-center space-x-4">
          <span class="">账号</span>
          <div @click="handleLogout">
            <NButton> 退出登录 </NButton>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style></style>
