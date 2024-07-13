import { defineStore } from 'pinia'
import type { StarCourse } from '@/views/course/index.vue'
export const useCourseStore = defineStore('course-store', {
  state: () => ({
    courseCuhkCode: '',
    starCourses: [] as StarCourse[],
  }),
  actions: {
    setCourseName(courseCuhkCode: string) {
      this.courseCuhkCode = courseCuhkCode
    },
    setStarCourses(starCourses: StarCourse[]) {
      this.starCourses = starCourses
    },
  },
})
