<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { NIcon } from 'naive-ui';
import { ArrowForwardIosOutlined } from '@vicons/material';
import { useCourseStore } from '@/store'
import { getStarCourses } from '@/api'
import type { StarCourse } from '@/views/course/index.vue'
import {  useRouter } from 'vue-router';

const courseStore = useCourseStore()
const router = useRouter();

const starCourses = computed(() => courseStore.starCourses) || getStarCourses()
onMounted(async () => {
  if (starCourses.value.length === 0) {
    const res = await getStarCourses();
    courseStore.setStarCourses(res.data as StarCourse[]);
  }
});

function goPreview(courseId: string) {
  router.push('/m/preview?courseId=' + courseId);
}

</script>

<template>
  <div class="p-4 font-semibold">
    <h2 class="py-8 text-base">我的课程</h2>
    <div class="h-full space-y-4">
      <div v-for="course in starCourses" :key="course.courseId"
        class="flex flex-nowrap justify-between cursor-pointer mt-4">
        <span class="left">{{ course.courseName }}</span>
        <div class="right font-normal flex items-center" @click="goPreview(course.courseId)">
          <span>课件预览</span>
          <n-icon>
            <ArrowForwardIosOutlined />
          </n-icon>
        </div>
      </div>
    </div>

  </div>
</template>

<style scoped lang="scss">
.right {
  color: #8554ED;
}
</style>