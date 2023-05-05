<script setup lang='ts'>
import { defineAsyncComponent, ref } from 'vue'
import { HoverButton, SvgIcon, UserAvatar } from '@/components/common'
import QcCode from '@/assets/QcCode.jpg'
const Setting = defineAsyncComponent(() => import('@/components/common/Setting/index.vue'))

const show = ref(false)
</script>

<template>
	<div style="height: 120px;border-top: 1px solid #eeeeee" class="items-center justify-center p-1">
		<img :src="QcCode" style="height:100%" class="m-auto w-auto">
	</div>
	<footer class="flex items-center justify-between min-w-0 p-4 overflow-hidden border-t dark:border-neutral-800">
		<div class="flex-1 flex-shrink-0 overflow-hidden">
			<UserAvatar />
		</div>
		<HoverButton @click="show = true">
      <span class="text-xl text-[#4f555e] dark:text-white">
        <SvgIcon icon="ri:settings-4-line" />
      </span>
		</HoverButton>
		<Setting v-if="show" v-model:visible="show" />
	</footer>
</template>
