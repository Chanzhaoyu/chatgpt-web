<script setup lang="ts">
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import { agentHello } from '@/api/agentChat'

const route = useRoute()

const agent = route.params.agent
const agenthello = ref('')
agentHello({ agent }).then((res) => {
  if (res.data)
    agenthello.value = res.data
})
</script>

<template>
  <div class="flex justify-center w-full items-center">
    <img src="@/assets/news.png" alt="logo" />
    <div class="flex justify-center items-center flex-col" style="margin-left: 5%;">
      <!--                    <span style="color: #1B2559;font-size: 28px;font-weight: bolder">👋 你好，我是AI薯塔，</span> -->
      <!--                    <span style="color: #1B2559;font-size: 28px;font-weight: bolder">我可以告诉你最新的龙大资讯🙋</span> -->
      <span style="color: #1B2559;font-size: 28px;font-weight: bolder">{{ agenthello }}</span>
    </div>
  </div>
</template>

<style scoped lang="scss">
:deep(.n-input) {
	border-radius: 40px;
}

.send-button {
	width: var(--n-width);
	height: var(--n-height);
}

.tips {
	width: 47.5%;
	height: 100%;
	margin-top: 3%;

	.tips-title {
		font-size: 16px
	}

	.tips-text {
		font-size: 16px;
		color: black;
		margin-left: 3%
	}

	.tips-button {
		background-color: #CDC7EB;
		border-radius: 10px;
		height: 10%;
		margin-bottom: 3%;
		cursor: pointer;
	}
}
</style>
