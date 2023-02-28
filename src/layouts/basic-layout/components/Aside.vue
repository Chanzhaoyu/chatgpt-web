<script lang="ts" setup>
import { useRouter } from 'vue-router'
import { HoverButton, OpenAILogo, SvgIcon } from '@/components/common'

const router = useRouter()

function toRoute(pathName: string) {
  router.push({ name: pathName })
}
</script>

<template>
  <aside class="py-4 flex flex-col items-center justify-between w-20 h-full bg-[#e0e1e5] dark:bg-[#1e1f22]">
    <div class="flex flex-col flex-1 space-y-4">
      <a
        class="flex items-center justify-center w-12 h-12 bg-white rounded-lg cursor-pointer"
        @click="toRoute('Root')"
      >
        <span class="text-2xl">
          <OpenAILogo />
        </span>
      </a>
    </div>
    <div class="flex flex-col justify-center space-y-4">
      <HoverButton class="text-2xl" @click="toRoute('User')">
        <img src="@/assets/avatar.jpg" class="object-cover w-full h-full overflow-hidden rounded-full" alt="avatar">
      </HoverButton>
      <HoverButton class="text-2xl" @click="toRoute('Setting')">
        <SvgIcon icon="ri:settings-4-line" />
      </HoverButton>
    </div>
  </aside>
</template>
