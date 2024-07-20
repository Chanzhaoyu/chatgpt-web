<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { NIcon } from 'naive-ui'
import { ArrowForwardIosOutlined } from '@vicons/material'
import { useRouter } from 'vue-router'
import { useCourseStore } from '@/store'
import { getStarCourses } from '@/api'
import type { StarCourse } from '@/views/course/index.vue'

const courseStore = useCourseStore()
const router = useRouter()

const starCourses = computed(() => courseStore.starCourses) || getStarCourses()
onMounted(async () => {
  if (starCourses.value.length === 0) {
    const res = await getStarCourses()
    courseStore.setStarCourses(res.data as StarCourse[])
  }
})

function goPreview(courseId: string) {
  router.push(`/m/preview?courseId=${courseId}`)
}
</script>

<template>
  <div class="p-4 font-semibold">
    <h2 class="py-8 text-base">
      我的课程
    </h2>
    <div class="h-full space-y-4">
      <template v-if="starCourses.length">
        <div
          v-for="course in starCourses"
          :key="course.courseId"
          class="flex flex-nowrap justify-between cursor-pointer mt-4"
        >
          <div>
            <p>
              {{ course.courseCuhkCode }}
            </p>
            <p class="text-sm font-light line-clamp-2">
              {{ course.courseName }}
            </p>
          </div>
          <div class="right font-normal flex items-center" @click="goPreview(course.courseId)">
            <span class="whitespace-nowrap ml-2">课件预览</span>
            <n-icon>
              <ArrowForwardIosOutlined />
            </n-icon>
          </div>
        </div>
      </template>
      <div v-else>
        <div class="text-center font-normal">
          <p>
            您当前的收藏为空
          </p>
          <p>去发现并收藏感兴趣的课程吧！</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.right {
  color: #8554ED;
}
.line-clamp-2 {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: normal;
}
</style>
