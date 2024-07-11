<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router';
import { NIcon, NSelect, useDialog } from 'naive-ui'
import { SearchOutlined } from '@vicons/material'
import CourseCard from './components/CourseCard.vue'
import { getCourseList, getStarCourses, courseStar, courseUnStar } from '@/api'
import { useBasicLayout } from '@/hooks/useBasicLayout'
import { t } from '@/locales'
import { useCourseStore } from '@/store'

interface ApiCourse {
  courseId: string;
  courseName: string;
  courseCuhkCode: string;
  iconUrl: string | null;
}

export interface Course {
  value: string;
  label: string;
  courseCuhkCode: string;
  courseName: string;
  iconUrl: string | null;
  star: boolean;
}

export interface StarCourse {
  courseId: string;
  courseName: string;
}

const { isMobile } = useBasicLayout()
const courseStore = useCourseStore()
const courses = ref<Course[]>([]);
const selectedCourse = ref<Course[]>([]);

const placeholder = computed(() => {
  if (isMobile.value)
    return t('course.placeholderMobile')
  return t('course.placeholder')
})

const dialog = useDialog()

const fetchCourses = async () => {
  try {
    const [courseResponse, starResponse] = await Promise.all([
      getCourseList<ApiCourse[]>(),
      getStarCourses<StarCourse[]>()
    ]);
    const starCourseIds = new Set(starResponse.data.map(course => course.courseId));
    courses.value = courseResponse.data.map((course) => ({
      value: course.courseId,
      label: `${course.courseCuhkCode}-${course.courseName}`,
      courseCuhkCode: course.courseCuhkCode,
      courseName: course.courseName,
      iconUrl: course.iconUrl,
      star: starCourseIds.has(course.courseId)
    }));
    selectedCourse.value = [...courses.value];
    courseStore.setStarCourses(starResponse && starResponse.data);
  } catch (error) {
    let message = '请稍后再试';
    if (typeof error === "object" && error !== null && "message" in error && typeof (error as { message: string }).message === "string") {
      message = (error as { message: string }).message;
    } else if (error instanceof Error) {
      message = error.toString();
    }
    dialog.error({
      title: '错误',
      content: message,
      positiveText: '我知道了',
    })
    console.error('Error fetching course list:', error);

  }
};

onMounted(() => {
  fetchCourses();
});

function handleUpdate(newValue: string) {
  if (newValue) {
    selectedCourse.value = [courses.value.find(course => course.value === newValue) ?? { value: '', label: '', courseCuhkCode: '', courseName: '', iconUrl: null, star: false }];
  }
}
const handleClear = () => {
  selectedCourse.value = [...courses.value];
};

const starChanged = async ({ courseId, star }: { courseId: string, star: number }) => {
  try {
    if (star) {
      await courseUnStar(courseId);
    } else {
      await courseStar(courseId);
    }
    fetchCourses();
  } catch (error) {
    let message = '请稍后再试';
    if (typeof error === "object" && error !== null && "message" in error && typeof (error as { message: string }).message === "string") {
      message = (error as { message: string }).message;
    } else if (error instanceof Error) {
      message = error.toString();
    }
    dialog.error({
      title: '错误',
      content: message,
      positiveText: '我知道了',
    })
    console.error('Error fetching course list:', error);
  }
};

interface CourseInfo {
  courseId: string;
  courseCuhkCode: string;
}
const router = useRouter();
function navigateToCourse({ courseId, courseCuhkCode }: CourseInfo) {
  courseStore.setCourseName(courseCuhkCode);
  router.push({ path: '/m/preview', query: { courseId } });
}
</script>

<template>
  <div class="h-full w-full max-w-screen-xl m-auto dark:bg-[#101014]">
    <div class="flex flex-col items-center justify-between mt-10">
      <img src="/src/assets/rounded-logo.png" alt="logo" class="w-20 h-20">
      <h1 class="flex-nowrap mt-5 text-3xl font-bold" style="color: #1B2559;">AI辅助PPT学习，轻松掌握课程要点</h1>
    </div>
    <div class="flex items-center justify-between mx-60 mt-5">
      <n-select class="min-w-32" size="large" filterable clearable :placeholder="placeholder" :options="courses"
        @update:value="handleUpdate" @clear="handleClear">
        <template #arrow>
          <n-icon>
            <SearchOutlined />
          </n-icon>
        </template>
      </n-select>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-y-12 py-20">
      <CourseCard v-for="course in selectedCourse" :key="course.value" :course="course"
        @click="navigateToCourse({ courseId: course.value, courseCuhkCode: course.courseCuhkCode })"
        @starChanged="starChanged" class="hover:cursor-pointer" />
    </div>
  </div>
</template>
