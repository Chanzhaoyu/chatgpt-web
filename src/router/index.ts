import type { App } from 'vue'
import type { RouteRecordRaw } from 'vue-router'
import { createRouter, createWebHashHistory } from 'vue-router'
import { setupPageGuard } from './permission'
import { ROUTER } from './const'
import { ChatLayout } from '@/views/chat/layout'
import Model from '@/views/model/list/index.vue'
import CreateModel from '@/views/model/create/index.vue'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: ROUTER.name.root,
    component: ChatLayout,
    redirect: '/chat',
    children: [
      {
        path: '/chat/:uuid?',
        name: ROUTER.name.chat,
        component: () => import('@/views/chat/index.vue'),
      },
    ],
  },
  {
    path: '/model',
    name: ROUTER.name.model,
    component: Model,
  },
  {
    path: '/model/create',
    name: ROUTER.name.modelCreate,
    component: CreateModel,
  },
  {
    path: '/404',
    name: ROUTER.name.exception404,
    component: () => import('@/views/exception/404/index.vue'),
  },

  {
    path: '/500',
    name: ROUTER.name.exception500,
    component: () => import('@/views/exception/500/index.vue'),
  },

  {
    path: '/:pathMatch(.*)*',
    name: ROUTER.name.notFound,
    redirect: '/404',
  },
]

export const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior: () => ({ left: 0, top: 0 }),
})

setupPageGuard(router)

export async function setupRouter(app: App) {
  app.use(router)
  await router.isReady()
}
