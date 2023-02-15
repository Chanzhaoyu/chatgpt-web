<script lang="ts" setup>
interface Props {
  reversal?: boolean
  error?: boolean
}

defineProps<Props>()
</script>

<template>
  <div class="p-2 mt-2 rounded-md" :class="[reversal ? 'bg-[#d2f9d1]' : 'bg-[#f4f6f8]']">
    <span v-highlight class="leading-relaxed whitespace-pre-wrap">
      <slot />
    </span>
  </div>
</template>

<style>
.hljs {
  background-color: #fff0 !important;
}
</style>
