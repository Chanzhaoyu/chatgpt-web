<script setup lang="ts">
import { ref } from 'vue';
import { NIcon, NButton, NForm, NFormItem, NInput } from 'naive-ui';
import { PersonFilled, AddFilled } from '@vicons/material'
const name = ref('');
const signature = ref('');

function addPhoto() {
  // 实现上传照片的逻辑
  console.log('Add photo clicked');
}

function submitForm() {
  console.log('Form submitted:', name.value, signature.value);
}

const profileImage = ref<string | null>(null);
const fileInput = ref<HTMLInputElement | null>(null);

const triggerFileUpload = () => {
  fileInput.value?.click();
};

const handleFileUpload = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files[0]) {
    const reader = new FileReader();
    reader.onload = (e) => {
      profileImage.value = e.target?.result as string;
    };
    reader.readAsDataURL(target.files[0]);
  }
};

</script>

<template>
  <div class="flex items-center justify-center min-h-screen">
    <div class="w-1/2 p-8 rounded-lg">
      <div class="flex items-center mb-4 justify-center">
        <div @click="triggerFileUpload" class="relative w-24 h-24  cursor-pointer">
          <div class="rounded-full overflow-hidden w-full h-full">
            <img v-if="profileImage" :src="profileImage" alt="Profile" class="w-full h-full object-cover">
          <div v-else class="w-full h-full flex items-center justify-center" style="background-color: #EBE8FC;">
            <n-icon size="300%" color="#A9A2C8">
              <PersonFilled />
            </n-icon>
          </div>
          </div>
          <div class="absolute bottom-0 right-0 bg-purple-500 text-white rounded-full p-1 w-8 h-8 flex items-center justify-center">
            <n-icon size="150%">
              <AddFilled />
            </n-icon>
          </div>
          <input ref="fileInput" type="file" accept="image/*" class="hidden" @change="handleFileUpload">
        </div>
      </div>
      <n-form class="space-y-4">
        <n-form-item label="昵称" path="name">
          <n-input v-model:value="name" placeholder="请输入你的超酷昵称 😎" />
        </n-form-item>
        <n-form-item label="个性签名">
          <n-input v-model:value="signature" placeholder="一句话介绍你的独特魅力 💬" />
        </n-form-item>
        <n-button block size="large" type="primary" @click="submitForm">完成</n-button>
      </n-form>
    </div>
  </div>
</template>

<style scoped lang="scss">
.n-button {
  height: 36px;
}
</style>