<script setup lang='ts'>
import type { CSSProperties, Ref } from 'vue'
import { computed, onMounted, ref, watch, watchEffect } from 'vue'
import { NIcon, NLayout, NLayoutContent, NLayoutSider } from 'naive-ui'
import { useRoute, useRouter } from 'vue-router'
import { AccountCircleFilled } from '@vicons/material'
import { Tools, UserMultiple } from '@vicons/carbon'
import Permission from './Permission.vue'
import { useBasicLayout } from '@/hooks/useBasicLayout'
import { useAppStore, useAuthStore, useChatStore } from '@/store'
import { PromptStore } from '@/components/common'

interface ActiveStatus {
  chat: boolean
  course: boolean
  [key: string]: boolean
}

const router = useRouter()
const route = useRoute()
const appStore = useAppStore()
const chatStore = useChatStore()
const authStore = useAuthStore()

const activeStatus: Ref<ActiveStatus> = ref({
  chat: false,
  course: false,
})

const { isMobile } = useBasicLayout()
const show = ref(false)
const pptToolsPaths = ['/course', '/preview', '/pdf']

watchEffect(() => {
  Object.keys(activeStatus.value).forEach((key) => {
    activeStatus.value[key as keyof ActiveStatus] = false
  })

  if (route.path.includes('/chat'))
    activeStatus.value.chat = true
  else if (pptToolsPaths.some(path => route.path.includes(path)))
    activeStatus.value.course = true
})

const collapsed = computed(() => appStore.siderCollapsed)

const needPermission = computed(() => !!authStore.session?.auth && !authStore.token)

const getMobileClass = computed(() => {
  if (isMobile.value)
    return ['rounded-none', 'shadow-none']
  return ['rounded-md', 'shadow-md', 'dark:border-neutral-800']
})
const getMobileClassSider = computed<CSSProperties>(() => {
  if (isMobile.value) {
    return {
      position: 'fixed',
      zIndex: 50,
    }
  }
  return {}
})

const getContainerClass = computed(() => {
  return [
    'h-full',
    { 'pl-[400px]': !isMobile.value && !collapsed.value },
  ]
})
const mobileSafeArea = computed(() => {
  if (isMobile.value) {
    return {
      paddingBottom: 'env(safe-area-inset-bottom)',
    }
  }
  return {}
})

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

function setActiveAndNavigate(activeKey: keyof ActiveStatus): void {
  // 重置所有状态
  for (const key in activeStatus.value)
    activeStatus.value[key] = false

  // 设置当前活动状态
  activeStatus.value[activeKey] = true
  console.log(`/m/${activeKey}`)

  router.push(`/m/${activeKey}`)
}

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

function goMyPage() {
  router.push('/m/my')
}
</script>

<template>
  <div class="h-full dark:bg-[#24272e] transition-all" :class="[isMobile ? 'p-0' : 'p-0']">
    <div class="h-full overflow-hidden" :class="getMobileClass">
      <NLayout class="z-40 transition" :class="getContainerClass" has-sider>
        <div class="sider">
          <NLayoutSider
            :collapsed="collapsed" :collapsed-width="0" :width="400" :show-trigger="false"
            collapse-mode="transform" position="absolute" bordered :style="getMobileClassSider"
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
                  <div
                    :class="{ 'menu-tab-agent-activate': activeStatus.chat }"
                    class="menu-tab-agent flex flex-col justify-center items-center"
                    @click="setActiveAndNavigate('chat')"
                  >
                    <n-icon size="200%">
                      <UserMultiple color="white" />
                    </n-icon>
                    <span class="menu-tab-text">智能体</span>
                  </div>
                  <div
                    :class="{ 'menu-tab-agent-activate': activeStatus.course }"
                    class="menu-tab-agent flex flex-col justify-center items-center"
                    @click="setActiveAndNavigate('course')"
                  >
                    <n-icon size="200%">
                      <Tools color="white" />
                    </n-icon>
                    <span class="menu-tab-text">PPT工具</span>
                  </div>
                </div>
                <div class="flex flex-col w-full justify-center items-center cursor-pointer" @click="goMyPage">
                  <n-icon size="300%">
                    <AccountCircleFilled color="white" />
                  </n-icon>
                  <span class="account-center-test">我的</span>
                </div>
              </div>
              <div class="flex flex-col h-full w-full sidebar-menu" :style="mobileSafeArea">
                <main class="flex flex-col flex-1 min-h-0">
                  <!-- 为左二侧边栏视图预留位置 -->
                  <router-view name="secondaryMenu" />
                </main>
              </div>
            </div>
          </NLayoutSider>
          <template v-if="isMobile">
            <div
              v-show="!collapsed" class="fixed inset-0 z-40 w-full h-full bg-black/40"
              @click="handleUpdateCollapsed"
            />
          </template>
          <PromptStore v-model:visible="show" />
        </div>
        <NLayoutContent class="h-full">
          <RouterView v-slot="{ Component, route }">
            <component :is="Component" :key="route.fullPath" />
          </RouterView>
        </NLayoutContent>
      </NLayout>
    </div>
    <Permission :visible="needPermission" />
  </div>
</template>

<style scoped lang="scss">
aside {
  background-color: rgb(246, 245, 252);
}

.sidebar-purple {
  background-color: #8554ED;
  border-radius: 0 30px 0 0;
  width: 30%;

  .sidebar-purple-button {
    width: 60%;
    height: 10%
  }

  .logo-logo {
    font-size: 24px
  }

  .logo-test {
    color: white;
    font-size: 18px
  }

  .account-center-test {
    color: white;
    font-size: 13px
  }

  .menu-tab {
    margin-bottom: auto;
    margin-top: 60%;
    height: 100%;

    .menu-tab-agent {
      width: 70%;
      height: 7%;
      margin-top: 2rem;
      opacity: 80%;
      // background-color: #AB8FE7;
      border-radius: 10px;

      .menu-tab-text {
        font-size: 13px;
        color: white;
      }
    }

    .menu-tab-agent:hover {
      cursor: pointer;
      width: 70%;
      height: 7%;
      margin-top: 2rem;
      opacity: 100% !important;
      background-color: #AB8FE7;
      border-radius: 10px;

      .menu-tab-text {
        font-size: 13px;
        color: white;
      }
    }

    .menu-tab-agent-activate {
      cursor: pointer;
      width: 70%;
      height: 7%;
      margin-top: 2rem;
      opacity: 100% !important;
      background-color: #AB8FE7;
      border-radius: 10px;

      .menu-tab-text {
        font-size: 13px;
        color: white;
      }
    }
  }

}

.sidebar-menu {
  background-color: rgb(246, 245, 252);
}

:deep(.n-button) {
  width: 100%;
  height: 100%;
  border-radius: 30px;
}
</style>
