<script setup lang='ts'>
import { computed, onMounted, ref } from "vue";
import { NSpin } from "naive-ui";
import { fetchChatConfig } from "@/api";
import pkg from "@/../package.json";
import { useAuthStore } from "@/store";

interface ConfigState {
  timeoutMs?: number;
  reverseProxy?: string;
  apiModel?: string;
  socksProxy?: string;
  httpsProxy?: string;
  balance?: string;
}

const authStore = useAuthStore();

const loading = ref(false);

const config = ref<ConfigState>();

const visitor = {
  recentActiveVisitors: "0",
  todayVisitors: "0",
  todayPageviews: "0",
  yesterdayVisitors: "0",
  yesterdayPageviews: "0",
  monthPageviews: "0",
  totalPageviews: "0",
};

let title = [
  "最近活跃访客",
  "今日访问人数",
  "今日访问量",
  "昨日人数",
  "昨日访问量",
  "本月访问量",
  "总访问量",
];

const isChatGPTAPI = computed<boolean>(() => !!authStore.isChatGPTAPI);

async function fetchConfig() {
  try {
    loading.value = true;
    fetch("https://v6-widget.51.la/v6/K1A2ITNXVzjXoI1U/quote.js")
      .then((res) => res.text())
      .then((d) => {
        let numList = d.match(/(?<=<\/span><span>).*?(?=<\/span><\/p>)/g);
        if (numList != null && numList.length >= 6) {
          visitor.recentActiveVisitors = numList[0];
          visitor.todayVisitors = numList[1];
          visitor.todayPageviews = numList[2];
          visitor.yesterdayVisitors = numList[3];
          visitor.yesterdayPageviews = numList[4];
          visitor.monthPageviews = numList[5];
          visitor.totalPageviews = numList[6];
        }
      });
    const { data } = await fetchChatConfig<ConfigState>();
    config.value = data;
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  fetchConfig();
});
</script>

<template>
  <NSpin :show="loading">
    <div class="p-4 space-y-4">
      <h2 class="text-xl font-bold">
        Version - {{ pkg.version }}
      </h2>
      <p>{{ $t("setting.api") }}：{{ config?.apiModel ?? '-' }}</p>
      <p v-if="isChatGPTAPI">
        {{ $t("setting.balance") }}：{{ config?.balance ?? '-' }}
      </p>
      <div class="p-2 space-y-2 rounded-md bg-neutral-100 dark:bg-neutral-700">
        <p>
          title[0]：{{ visitor.recentActiveVisitors ?? '-' }}
          title[1]：{{ visitor.todayVisitors ?? '-' }}
          title[2]：{{ visitor.todayPageviews ?? '-' }}
          title[3]：{{ visitor.yesterdayVisitors ?? '-' }}
          title[4]：{{ visitor.yesterdayPageviews ?? '-' }}
          title[5]：{{ visitor.monthPageviews ?? '-' }}
          title[6]：{{ visitor.totalPageviews ?? '-' }}
        </p>
      </div>
    </div>
  </NSpin>
</template>
