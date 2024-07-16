<script setup lang="ts">

import {NIcon} from "naive-ui";
import {ArrowRightAltFilled} from "@vicons/material";
import {ref} from "vue";
import {agentExampleQuestions} from "@/api/agentChat";
import {useRoute} from "vue-router";

const route = useRoute()

const agent = route.params.agent
const tipsArr = ref(['大概告诉我香港中文大学（深圳）六月都发生了什么事情？', '近期学校有什么体育比赛呢？', '下周有什么有趣的社团活动？', '近期有什么关于创新创业相关的活动？'])

agentExampleQuestions({ agent }).then((res) => {
	if (res.data)
		tipsArr.value = res.data
})

</script>

<template>
	<div class="flex h-full w-full flex-col items-start tips">
		<span class="tips-title">你可以尝试下面的例子...</span>
		<div class="flex w-full h-full flex-col items-start">
			<div
				v-for="(item, index) of tipsArr" :key="index"
				class="tips-button w-full flex flex-row items-center"
			>
				<span class="tips-text">{{ item }}</span>
				<n-icon size="35" color="black">
					<ArrowRightAltFilled />
				</n-icon>
			</div>
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
