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
    path: '/login',
    name: 'Login',
    component: () => import('@/views/system/login/index.vue'),
    meta: { title: 'Login' },
  },

  {
    path: '/403',
    name: '403',
    component: () => import('@/views/exception/403/index.vue'),
    meta: { title: '403' },
  },

  {
    path: '/404',
    name: '404',
    component: () => import('@/views/exception/404/index.vue'),
    meta: { title: '404' },
  },

  {
    path: '/:pathMatch(.*)*',
    name: 'notFound',
    redirect: '/404',
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
