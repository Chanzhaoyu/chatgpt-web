<script lang="ts" setup>
import { defineEmits, defineProps } from 'vue'
import { NIcon } from 'naive-ui'
import { StarBorderOutlined, StarOutlined } from '@vicons/material'
import type { Course } from '../index.vue'

const props = defineProps<{ course: Course }>()
const emit = defineEmits(['starChanged'])

const handleStar = () => {
  emit('starChanged', { courseId: props.course.value, star: props.course.star })
}
</script>

<template>
  <div
    class="course-card rounded-lg p-6 flex flex-col items-center justify-center text-center bg-gray-50 relative mx-10"
    style="background-color: rgb(246, 245, 252);border-radius: 20px;"
  >
    <div
      class="hover:cursor-pointer absolute top-3 left-4 flex items-center" style="color: #949FC9;"
      @click.stop="handleStar"
    >
      <n-icon size="large">
        <template v-if="course.star">
          <StarOutlined color="#E2953E" />
        </template>
        <template v-else>
          <StarBorderOutlined />
        </template>
      </n-icon>
      <span class="ml-1">{{ course.star ? '已' : '' }}收藏</span>
    </div>
    <img v-if="course.iconUrl" :src="course.iconUrl" alt="course image" class="h-32 object-cover my-4" />
    <div style="height: 40%;">
      <div class="text-lg">
        {{ course.courseCuhkCode }}
      </div>
      <div class="text-sm text-gray-500">
        {{ course.courseName }}
      </div>
    </div>
  </div>
</template>
