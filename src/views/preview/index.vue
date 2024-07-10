<script lang="ts" setup>
import { onMounted, ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router';
import { NButton, NIcon, useMessage, NSkeleton } from 'naive-ui';
import { KeyboardArrowRightOutlined } from '@vicons/material'
import { coursePdfs } from '@/api';
import { useCourseStore } from '@/store'

interface Pdf {
    pdfId: string;
    title: string;
    firstPageImageUrl: string;
}

const courseId = ref<string>('');
const pdfs = ref<Pdf[]>([]);
const loading = ref(true);
const courseStore = useCourseStore()
const courseCuhkCode = computed(() => courseStore.courseCuhkCode);
const message = useMessage()
const router = useRouter();

const getPdfInfo = async () => {
    try {
        if (courseId.value) {
            const res = await coursePdfs<Pdf[]>(courseId.value);
            if (res.data.length) {
                pdfs.value = res.data.map((item: any) => {
                    return {
                        pdfId: item.pdfId,
                        title: item.title,
                        firstPageImageUrl: item.firstPageImageUrl,
                    };
                });
                loading.value = false;
            } else {
                throw new Error('请求失败')
            }
        } else {
            throw new Error('课程id为空')
        }
    } catch (error) {
        message.warning('课程无法访问或找不到课程')
        router.push('/course');
        console.log('error')
    }
};
const route = useRoute();
onMounted(() => {
    courseId.value = route.query.courseId as string;
    getPdfInfo()
});


function goBack() {
    router.push('/m/course');
}

</script>

<template>
    <div class="mx-8">
        <div class="mt-16 mb-14">
            <p class="text-2xl font-bold text-center">{{ courseCuhkCode }}</p>
        </div>
        <main class="flex flex-wrap ">
            <n-skeleton v-if="loading" v-for="i in 4" :key="i" :height="200" :width="220" :sharp="false" size="medium"
                class="m-5" />
            <div v-else class="flex justify-center">
                <div class="container ">
                    <div v-for="item in pdfs" :key="item.pdfId" class="bg-white p-4 flex flex-col items-center">
                        <img :src="item.firstPageImageUrl" :alt="item.title" class="w-56" />
                        <p class="text-sm">{{ item.title }}</p>
                    </div>
                </div>
            </div>
        </main>
        <footer class="float-right p-12">
            <n-button text @click="goBack" class="flex items-center" style="color: #8554ED;">
                返回课程搜索
                <n-icon size="large" style="color: #8554ED;">
                    <KeyboardArrowRightOutlined />
                </n-icon>
            </n-button>
        </footer>
    </div>

</template>
<style scoped>
.container {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(14rem, 1fr));
    grid-gap: 1rem;
}
</style>