import type { App } from 'vue'
import type { RouteRecordRaw } from 'vue-router'
import { createRouter, createWebHistory } from 'vue-router'
import PrimaryMenu from '@/components/common/PrimaryMenu/index.vue';
const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/login',
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/login/index.vue'),
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('@/views/register/index.vue'),
  },
  {
    path: '/reset',
    name: 'Reset',
    component: () => import('@/views/reset/index.vue'),
  },
  {
    path: '/change',
    name: 'Change',
    component: () => import('@/views/change/index.vue'),
  },
  {
    path: '/m', // main， ChatGPT 的 url 就是用一个单词，看起来简洁吧
    component: PrimaryMenu,
    children: [
      {
        path: 'chat',
        name: 'Chat',
        components: {
          default: () => import('@/views/chat/index.vue'),
          secondaryMenu: () => import('@/views/chat/components/ChatMenu/index.vue'),
        }
      },
      {
        path: 'course',
        name: 'Course',
        components: {
          default: () => import('@/views/course/index.vue'),
          secondaryMenu: () => import('@/components/common/CourseMenu/index.vue'),
        }
      },
      {
        path: 'preview',
        name: 'Preview',
        components: {
          default: () => import('@/views/preview/index.vue'),
          secondaryMenu: () => import('@/components/common/CourseMenu/index.vue'),
        }
      },
      {
        path: 'my',
        name: 'My',
        components: {
          default: () => import('@/views/my/index.vue'),
          secondaryMenu: () => import('@/views/my/components/MyMenu/index.vue'),
        }
      }
      // 在此添加其他包含侧边栏的页面路由
    ]
  },
  {
    path: '/404',
    name: '404',
    component: () => import('@/views/exception/404/index.vue'),
  },

  {
    path: '/500',
    name: '500',
    component: () => import('@/views/exception/500/index.vue'),
  },

  {
    path: '/:pathMatch(.*)*',
    name: 'notFound',
    redirect: '/404',
  },
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior: () => ({ left: 0, top: 0 }),
})

// setupPageGuard(router)

export async function setupRouter(app: App) {
  app.use(router)
  await router.isReady()
}
