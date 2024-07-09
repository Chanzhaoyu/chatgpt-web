import { defineStore } from 'pinia'

export const useCourseStore = defineStore('course-store', {
    state: () => ({
        courseCuhkCode: ''
    }),
    actions: {
        setCourseName(courseCuhkCode: string) {
            this.courseCuhkCode = courseCuhkCode;
        }
    }
});