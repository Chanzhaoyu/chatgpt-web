<script setup lang='ts'>
import type { CSSProperties } from 'vue'
import { computed, ref, watch } from 'vue'
import { NButton, NIcon, NLayoutSider, NTabPane, NTabs, useDialog } from 'naive-ui'
import { AccountCircleFilled, AddCircleOutlineOutlined } from '@vicons/material'
import List from './List.vue'
import agent from './agent.vue'
import { useAppStore, useChatStore } from '@/store'
import { useBasicLayout } from '@/hooks/useBasicLayout'
import { PromptStore } from '@/components/common'
import { t } from '@/locales'

const appStore = useAppStore()
const chatStore = useChatStore()

const dialog = useDialog()

const { isMobile } = useBasicLayout()
const show = ref(false)

const collapsed = computed(() => appStore.siderCollapsed)

function handleAdd() {
  chatStore.addHistory({ title: t('chat.newChatTitle'), uuid: Date.now(), isEdit: false, isAgent: false })
  if (isMobile.value)
    appStore.setSiderCollapsed(true)
}

function handleUpdateCollapsed() {
  appStore.setSiderCollapsed(!collapsed.value)
}

function handleClearAll() {
  dialog.warning({
    title: t('chat.deleteMessage'),
    content: t('chat.clearHistoryConfirm'),
    positiveText: t('common.yes'),
    negativeText: t('common.no'),
    onPositiveClick: () => {
      chatStore.clearHistory()
      if (isMobile.value)
        appStore.setSiderCollapsed(true)
    },
  })
}

const getMobileClass = computed<CSSProperties>(() => {
  if (isMobile.value) {
    return {
      position: 'fixed',
      zIndex: 50,
    }
  }
  return {}
})

const mobileSafeArea = computed(() => {
  if (isMobile.value) {
    return {
      paddingBottom: 'env(safe-area-inset-bottom)',
    }
  }
  return {}
})

watch(
  isMobile,
  (val) => {
    appStore.setSiderCollapsed(val)
  },
  {
    immediate: true,
    flush: 'post',
  },
)
</script>

<template>
  <NLayoutSider
    :collapsed="collapsed"
    :collapsed-width="0"
    :width="260"
    :show-trigger="false"
    collapse-mode="transform"
    position="absolute"
    bordered
    :style="getMobileClass"
    @update-collapsed="handleUpdateCollapsed"
  >
    <div class="flex h-full">
      <div class="flex flex-col h-full sidebar-purple" :style="mobileSafeArea">
        <div class="flex flex-col w-full justify-center items-center" style="margin-top: 25%;">
          <!-- <n-icon size="200%"> -->
          <span class="logo-logo">🍟</span>
          <!-- </n-icon> -->
          <span class="logo-test">薯塔</span>
        </div>
        <div class="flex flex-col justify-center items-center w-full h-full">
          <!-- <n-button class="sidebar-purple-button" type=""></n-button> -->
          <n-tabs
            type="card"
            placement="left"
          >
            <n-tab-pane name="oasis" tab="1">
            </n-tab-pane>
            <n-tab-pane name="the beatles" tab="2">
            </n-tab-pane>
          </n-tabs>
        </div>
        <div class="flex flex-col w-full justify-center items-center">
          <n-icon size="300%">
            <AccountCircleFilled color="white" />
          </n-icon>
          <span class="account-center-test">我的</span>
        </div>
      </div>
      <div class="flex flex-col h-full w-full sidebar-menu" :style="mobileSafeArea">
        <main class="flex flex-col flex-1 min-h-0">
          <div class="p-4">
            <NButton type="primary" @click="handleAdd">
              <template #icon>
                <n-icon><AddCircleOutlineOutlined /></n-icon>
              </template>
              {{ $t('chat.newChatButton') }}
            </NButton>
          </div>
          <div class="flex-1 min-h-0 pb-4 overflow-hidden">
            <agent />
          </div>
          <div class="flex-1 min-h-0 pb-4 overflow-hidden">
            <List />
          </div>
          <div class="flex items-center p-4 space-x-4">
          </div>
        </main>
      </div>
    </div>
  </NLayoutSider>
  <template v-if="isMobile">
    <div v-show="!collapsed" class="fixed inset-0 z-40 w-full h-full bg-black/40" @click="handleUpdateCollapsed" />
  </template>
  <PromptStore v-model:visible="show" />
</template>

<style scoped lang="scss">
.sidebar-purple{
  background-color: #8554ED;
  border-radius: 0 30px 0 0;
  width: 40%;
  .sidebar-purple-button{
    width: 60%;
    height: 10%
  }
  .logo-logo{
    font-size: 24px
  }
  .logo-test{
    color: white;
    font-size: 18px
  }
  .account-center-test{
    color: white;
    font-size: 13px
  }
}

.sidebar-menu{
  background-color: rgb(246, 245, 252);
}
:deep(.n-button){
  width: 100%;
  height: 100%;
  border-radius: 30px;
}
</style>
