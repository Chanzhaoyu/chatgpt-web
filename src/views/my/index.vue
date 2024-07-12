<script setup lang="ts">
import { computed, ref } from 'vue';
import { NIcon, NButton, NForm, NFormItem, NInput } from 'naive-ui';
import { PersonFilled, AddFilled } from '@vicons/material'
import { useMyStore } from '@/store/modules/my';
import profileImagePath from '@/assets/default-avatar.png';
const myStore = useMyStore();
const currentOption = computed(() => myStore.currentOption);

const name = ref('');

const signature = ref('');
function addPhoto() {
  // 实现上传照片的逻辑
  console.log('Add photo clicked');
}

function submitForm() {
  console.log('Form submitted:', name.value, signature.value);
}
const profileImage = ref(profileImagePath);
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

function handleClick(option: string) {
  console.log(`You clicked: ${option}`);
}

</script>

<template>
  <div class="flex items-center justify-center min-h-screen">
    <div class="w-1/2">
      <template v-if="currentOption === 'profile'">
        <div class="flex items-center mb-4 justify-center">
          <div @click="triggerFileUpload" class="relative w-24 h-24  cursor-pointer">
            <div class="rounded-full overflow-hidden w-full h-full">
              <img :src="profileImage" alt="Profile" class="w-full h-full object-cover">
            </div>
            <div
              class="absolute bottom-0 right-0 bg-purple-500 text-white rounded-full p-1 w-8 h-8 flex items-center justify-center">
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
      </template>
      <template v-else-if="currentOption === 'settings'">
        <div class="p-4">
          <div class="flex items-center mb-4">
            <img :src="profileImage" alt="Profile" class="w-24 object-cover">
            <div class="text-lg font-semibold ml-4">Karina</div>
          </div>
          <div class="flex flex-col space-y-2 setting-btn">
            <n-button text class="justify-start" @click="handleClick('Option 1')">
              <img src="@/assets/my-contact.png" alt="contact">
              联系客服
            </n-button>
            <n-button text class="justify-start" @click="handleClick('Option 2')">
              <img src="@/assets/my-about.png" alt="about">
              关于我们
            </n-button>
            <n-button text class="justify-start" @click="handleClick('Option 3')">
              <img src="@/assets/my-exit.png" alt="exit">
              退出登录
            </n-button>
          </div>
        </div>
      </template>
      <template v-else-if="currentOption === 'join'">
        <div class="flex items-center mb-4">
          <img src="@/assets/Ellipse 275.png" alt="">
          <p class="ml-4">👋 我们欢迎有意向共建PPT知识社区的朋友加入我们，成为共建者即可拥有自主上传PPT的权限，快来申请吧！</p>
        </div>
        <div class="flex items-center">
          <img src="https://generated.vusercontent.net/placeholder.svg" alt="qrcode-to-join-us" class="w-1/2">
          <p class="ml-6">⬅️扫码添加薯塔官方申请</p>
        </div>
      </template>
    </div>

  </div>
</template>

<style scoped lang="scss">
.n-button {
  height: 36px
}

.setting-btn .n-button {
  height: 50px;
  border-radius: 15px;
  background-color: #f5f5f5;
  display: flex;
  padding: 10px;
  justify-content: flex-start;
  &:hover {
    color: #333639;
    background-color: #e0e0e0;
  }
}

.setting-btn img {
  margin-right: 10px;
}
</style>