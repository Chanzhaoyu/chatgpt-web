<script setup lang="ts">
import { computed, ref } from 'vue';
import { NIcon } from 'naive-ui';
import { PersonFilled, SettingsFilled, CreateNewFolderFilled } from '@vicons/material'
import { useMyStore } from '@/store/modules/my';

const menuItems = [
  { icon: PersonFilled, label: '修改个人资料', value: 'profile' },
  { icon: SettingsFilled, label: '系统设置', value: 'settings' },
  { icon: CreateNewFolderFilled, label: '成为共建者', value: 'join' }
];

const myStore = useMyStore();

const currentOption = computed(() => myStore.currentOption);

function changeOption(option: string) {
  myStore.setCurrentOption(option);
}
</script>

<template>
  <div class="p-4 mt-10">
    <div v-for="item in menuItems" :key="item.label"
      :class="['border rounded-lg p-2 flex items-center font-semibold mb-2 cursor-pointer', { 'active': currentOption === item.value, 'not-active': currentOption!== item.value }]"
      @click="changeOption(item.value)">
      <n-icon size="200%" class="mr-2">
        <component :is="item.icon" />
      </n-icon>
      {{ item.label }}
    </div>
  </div>
</template>

<style scoped lang="scss">
.not-active {
  background-color: #F5F5F6;
  border-color: #EBE8FC;
}
.active {
  background-color: #EBE8FC;
  border-color: #CDC7EB;
}</style>