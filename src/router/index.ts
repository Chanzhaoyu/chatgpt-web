import type { App } from 'vue'
import type { RouteRecordRaw } from 'vue-router'
import { createRouter, createWebHashHistory } from 'vue-router'
import { BasicLayout } from '@/layouts'
import ChatLayout from '@/views/chat/layout/Layout.vue'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Root',
    component: BasicLayout,
    redirect: '/chat-root',
    meta: { title: 'Root' },
    children: [
      {
        path: '/chat-root',
        name: 'ChatRoot',
        component: ChatLayout,
        redirect: '/chat',
        meta: {},
        children: [
          {
            path: '/chat/:uuid?',
            name: 'Chat',
            component: () => import('@/views/chat/index.vue'),
          },
        ],
      },
      {
        path: '/user',
        name: 'User',
        component: () => import('@/views/system/user/index.vue'),
      },
      {
        path: '/setting',
        name: 'Setting',
        component: () => import('@/views/system/setting/index.vue'),
      },
    ],
  },
  {
    name: 'login',
    path: '/login',
    component: () => import('@/views/system/login/index.vue'),
    meta: { title: 'Login' },
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'notFound',
    component: () => import('@/views/exception/404/index.vue'),
  },
]

export const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior: () => ({ left: 0, top: 0 }),
})

export async function setupRouter(app: App) {
  app.use(router)
  await router.isReady()
}
