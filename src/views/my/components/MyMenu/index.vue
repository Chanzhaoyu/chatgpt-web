<script setup lang="ts">
import { ref } from 'vue';
import { NIcon, NButton, NForm, NFormItem, NInput } from 'naive-ui';

import { PersonFilled, SettingsFilled } from '@vicons/material'

</script>

<template>
  <div class="p-4 mt-10">
    <div class="border rounded-lg p-2 flex items-center bg-gray-300 font-semibold mb-2">
      <n-icon size="200%" class="mr-2">
        <PersonFilled />
      </n-icon>
      修改个人资料
    </div>
    <div class="border rounded-lg p-2 flex items-center bg-gray-300 font-semibold mb-2">
      <n-icon size="200%" class="mr-2">
        <SettingsFilled />
      </n-icon>
      系统设置
    </div>
    <div class="border rounded-lg p-2 flex items-center bg-gray-300 font-semibold mb-2">
      <n-icon size="200%" class="mr-2">
        <PersonFilled />
      </n-icon>
      成为共建者
    </div>
  </div>
</template>

<style scoped lang="scss"></style>