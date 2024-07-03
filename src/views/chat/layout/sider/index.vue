<!-- eslint-disable no-console -->
<script setup lang='ts'>
import type { CSSProperties } from 'vue'
import { computed, onMounted, ref, watch } from 'vue'
import { NButton, NIcon, NLayoutSider, useDialog } from 'naive-ui'
import { AccountCircleFilled, AddCircleOutlineOutlined } from '@vicons/material'
import { Tools, UserMultiple } from '@vicons/carbon'
import List from './List.vue'
import agent from './agent.vue'
import { useAppStore, useChatStore } from '@/store'
import { useBasicLayout } from '@/hooks/useBasicLayout'
import { PromptStore } from '@/components/common'

const appStore = useAppStore()
const chatStore = useChatStore()
const agentActivate = ref(true)
const pptActivate = ref(false)
const dialog = useDialog()

const { isMobile } = useBasicLayout()
const show = ref(false)

const collapsed = computed(() => appStore.siderCollapsed)

// function handleAdd() {
//   chatStore.addHistory({ title: t('chat.newChatTitle'), uuid: Date.now(), isEdit: false, isAgent: true })
//   if (isMobile.value)
//     appStore.setSiderCollapsed(true)
// }

function handleUpdateCollapsed() {
  appStore.setSiderCollapsed(!collapsed.value)
}

// function handleClearAll() {
//   dialog.warning({
//     title: t('chat.deleteMessage'),
//     content: t('chat.clearHistoryConfirm'),
//     positiveText: t('common.yes'),
//     negativeText: t('common.no'),
//     onPositiveClick: () => {
//       chatStore.clearHistory()
//       if (isMobile.value)
//         appStore.setSiderCollapsed(true)
//     },
//   })
// }

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

onMounted(() => {
  if (!chatStore.getChatIfExistByUuid(3333))
    chatStore.addHistory({ title: '凤凰GPT', uuid: 3333, isEdit: false, isAgent: true })
  if (!chatStore.getChatIfExistByUuid(2222))
    chatStore.addHistory({ title: '学姐Dora', uuid: 2222, isEdit: false, isAgent: true })
  if (!chatStore.getChatIfExistByUuid(1111))
    chatStore.addHistory({ title: '薯塔', uuid: 1111, isEdit: false, isAgent: true })
})
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
        <div class="menu-tab flex flex-col items-center w-full">
          <!-- <n-button class="sidebar-purple-button" type=""></n-button> -->
          <div :class="{ 'menu-tab-agent-activate': agentActivate }" class="menu-tab-agent flex flex-col justify-center items-center" @click="{ agentActivate = true; pptActivate = false }">
            <n-icon size="200%">
              <UserMultiple color="white" />
            </n-icon>
            <span class="menu-tab-text">智能体</span>
          </div>
          <div :class="{ 'menu-tab-agent-activate': pptActivate }" class="menu-tab-agent flex flex-col justify-center items-center" @click="{ agentActivate = false; pptActivate = true }">
            <n-icon size="200%">
              <Tools color="white" />
            </n-icon>
            <span class="menu-tab-text">PPT工具</span>
          </div>
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
            <NButton type="primary">
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
  .menu-tab{
    margin-bottom: auto;
    margin-top: 60%;
    height: 100%;
    .menu-tab-agent{
    width: 70%;
    height: 7%;
    margin-top: 2rem;
    opacity: 80%;
    // background-color: #AB8FE7;
    border-radius: 10px;
    .menu-tab-text{
      font-size: 13px;
      color: white;
      }
    }
    .menu-tab-agent:hover{
    cursor: pointer;
    width: 70%;
    height: 7%;
    margin-top: 2rem;
    opacity: 100% !important;
    background-color: #AB8FE7;
    border-radius: 10px;
    .menu-tab-text{
      font-size: 13px;
      color: white;
      }
    }
    .menu-tab-agent-activate{
      cursor: pointer;
    width: 70%;
    height: 7%;
    margin-top: 2rem;
    opacity: 100% !important;
    background-color: #AB8FE7;
    border-radius: 10px;
    .menu-tab-text{
      font-size: 13px;
      color: white;
      }
    }
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
