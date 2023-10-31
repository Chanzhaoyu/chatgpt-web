<script setup lang='ts'>
import type { CSSProperties } from 'vue'
import { computed, ref, watch, onUnmounted } from 'vue'
import { NButton, NLayoutSider } from 'naive-ui'
import List from './List.vue'
import Footer from './Footer.vue'
import { useAppStore, useChatStore } from '@/store'
import { useBasicLayout } from '@/hooks/useBasicLayout'
import { PromptStore } from '@/components/common'
import axios from 'axios';


const appStore = useAppStore()
const chatStore = useChatStore()

const { isMobile } = useBasicLayout()
const show = ref(false)

const collapsed = computed(() => appStore.siderCollapsed)


let intervalId: NodeJS.Timeout | null = null;
async function handleLocationAndAdd() {
  const isOk = await getLocationInfo();

  // 用户第一次点击时并授权成功时，设置定时器
  if (isOk) {
    handleAdd();
    if (!intervalId) {
      intervalId = setInterval(getLocationInfo, 60000); // 每 60 秒执行一次
    }

  // FIXME：目前即使不授权也允许新增会话
  } else {
    handleAdd();
  }
}

// 销毁定时器
onUnmounted(() => {
  if (intervalId) {
    clearInterval(intervalId);
  }
});

async function getLocationInfo() {
  // const ip = await getIPAddress() as string;
  const userAgent = getUserAgent();
  const location = await getGeoLocation() as string;
  toLog(userAgent, location);
  return location == "(-1,-1)" ? false : true;
}


// 暂没必要取 IP，因为依赖第三方网站，返回耗时较长
// @ts-ignore
async function getIPAddress() {
  let ipAddress: string = "unknown";
  try {
    const response = await axios.get('https://api.ipify.org?format=json');
    ipAddress = response.data.ip;
  } catch (error) {
    console.error("Failed to obtain IP address: ", error);
  }
  return ipAddress;
}

function getUserAgent() {
    return navigator.userAgent;
}

function getGeoLocation() {
  return new Promise((resolve, reject) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        resolve(`(${latitude},${longitude})`);

      }, error => {
        console.error("Failed to obtain location information:", error);
        resolve("(-1,-1)");
      });

    } else {
      console.error("This browser does not support obtaining location information");
      resolve("(-1,-1)");
    }
  });
}

async function toLog(userAgent: string, location: string) {
  const msg = `${userAgent} - ${location}`;
  try {
    axios.post("/tolog", { message: btoa(msg) });
  } catch (error) {
    console.error("Error to log: ", error);
  }
}

function handleAdd() {
  chatStore.addHistory({ title: 'New Chat', uuid: Date.now(), isEdit: false })
  if (isMobile.value)
    appStore.setSiderCollapsed(true)
}


function handleUpdateCollapsed() {
  appStore.setSiderCollapsed(!collapsed.value)
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
    :show-trigger="isMobile ? false : 'arrow-circle'"
    collapse-mode="transform"
    position="absolute"
    bordered
    :style="getMobileClass"
    @update-collapsed="handleUpdateCollapsed"
  >
    <div class="flex flex-col h-full" :style="mobileSafeArea">
      <main class="flex flex-col flex-1 min-h-0">
        <div class="p-4">
          <label class="block mb-2 text-red-500">
            {{ $t('chat.tips') }}
          </label>

          <NButton dashed block @click="handleLocationAndAdd">
            {{ $t('chat.newChatButton') }}
          </NButton>
        </div>
        <div class="flex-1 min-h-0 pb-4 overflow-hidden">
          <List />
        </div>
        <div class="p-4">
          <NButton block @click="show = true">
            {{ $t('store.siderButton') }}
          </NButton>
        </div>
      </main>
      <Footer />
    </div>
  </NLayoutSider>
  <template v-if="isMobile">
    <div v-show="!collapsed" class="fixed inset-0 z-40 w-full h-full bg-black/40" @click="handleUpdateCollapsed" />
  </template>
  <PromptStore v-model:visible="show" />
</template>
