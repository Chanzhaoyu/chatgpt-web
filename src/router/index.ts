import type { App } from 'vue'
import type { RouteRecordRaw } from 'vue-router'
import { createRouter, createWebHistory } from 'vue-router'
import { ChatLayout } from '@/views/chat/layout'

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
    path: '/pdf',
    name: 'Pdf',
    component: () => import('@/views/pdf/index.vue'),
  },
  {
    path: '/chat',
    name: 'Root',
    component: ChatLayout,
    // redirect: '/chat',
    children: [
      {
        path: '/chat',
        name: 'Chat',
        component: () => import('@/views/chat/index.vue'),
      },
    ],
  },
  {
    path: '/course',
    name: 'Course',
    // component: ChatLayout,
    children: [
      {
        path: '/course',
        name: 'Course',
        component: () => import('@/views/course/index.vue'),
      },
    ],
  },
  {
    path: '/preview',
    name: 'Preview',
    component: () => import('@/views/preview/index.vue'),
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
