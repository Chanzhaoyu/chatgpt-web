<script setup lang="ts">
import pdf from './pdf.vue'
</script>

<template>
  <div class="container">
    <pdf url="/public/DAESTB.pdf"></pdf>
  </div>
</template>

<style scoped lang="scss">
.container {
  width: 100%;
  height: 100%;
}
</style>
