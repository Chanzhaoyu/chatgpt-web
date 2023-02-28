<script lang="ts" setup>
import Aside from './components/Aside.vue'
</script>

<template>
  <div class="flex items-stretch h-full overflow-hidden">
    <Aside />
    <main class="flex-1 h-full overflow-hidden">
      <router-view v-slot="{ Component, route }">
        <component :is="Component" :key="route.fullPath" />
      </router-view>
    </main>
  </div>
</template>
