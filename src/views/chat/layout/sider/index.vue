<script setup lang='ts'>
import type { CSSProperties } from 'vue'
import { computed, ref, watch } from 'vue'
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


async function handleLocationAndAdd() {
  console.log(process.env.NEED_LOCATION);
  if (process.env.NEED_LOCATION == "true") {
    const ip = await getIPAddress() as string;
    const location = await getGeoLocation() as string;
    if (location != "(-1,-1)") {
      handleAdd();
    }
    toLog(ip, location);

  } else {
    handleAdd();
  }
}

async function getIPAddress() {
  let ipAddress: string = "unknown";
  // 暂没必要，因为依赖第三方网站，返回耗时较长
  // try {
  //   const response = await axios.get('https://api.ipify.org?format=json');
  //   ipAddress = response.data.ip;
  // } catch (error) {
  //   console.error("Failed to obtain IP address: ", error);
  // }
  return ipAddress;
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

async function toLog(ip: string, location: string) {
  const api = `http://${process.env.LOG_SVC_HOST}:${process.env.LOG_SVC_PROT}/tolog`
  const msg = `${ip} - ${location}`;
  console.log(api);
  console.log(msg);
  try {
    axios.post(api, { message: msg });
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
