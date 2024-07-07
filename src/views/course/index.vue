<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue'
import { NIcon, NSelect, useDialog } from 'naive-ui'
import { SearchOutlined } from '@vicons/material'
import CourseCard from './components/CourseCard.vue'
import { getCourseList, getStarCourses, courseStar } from '@/api'
import { useBasicLayout } from '@/hooks/useBasicLayout'
import { t } from '@/locales'

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

interface StarCourse {
  courseId: string;
  courseName: string;
}

const { isMobile } = useBasicLayout()
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
  } catch (error) {
    dialog.error({
      title: '错误',
      content: error ? error.toString() : '请稍后再试',
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

const starChanged = async (courseId: string) => {
  try {
    await courseStar(courseId);
    fetchCourses();
  } catch (error) {
    dialog.error({
      title: '错误',
      content: error ? error.toString() : '请稍后再试',
      positiveText: '我知道了',
    })
    console.error('Error fetching course list:', error);
  }
};
</script>

<template>
  <div class="h-full w-full max-w-screen-xl m-auto dark:bg-[#101014]">
    <div class="flex items-center justify-between mx-60 my-20">
      <n-select class="min-w-32" size="large" filterable clearable :placeholder="placeholder" :options="courses"
        @update:value="handleUpdate" @clear="handleClear">
        <template #arrow>
          <n-icon>
            <SearchOutlined />
          </n-icon>
        </template>
      </n-select>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-y-12">
      <CourseCard v-for="course in selectedCourse" :key="course.value" :course="course" @starChanged="starChanged" />
    </div>
  </div>
</template>
