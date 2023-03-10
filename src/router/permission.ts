import type { Router } from 'vue-router'
import { useAuthStoreWithout } from '@/store/modules/auth'

export function setupPageGuard(router: Router) {
  router.beforeEach(async (from, to, next) => {
    const authStore = useAuthStoreWithout()
    if (!authStore.user && from.path !== '/login') {
      try {
        await authStore.getUserInfo()
        next()
      }
      catch (error) {
        if (from.path !== '/login')
          next({ name: 'login' })
        else
          next()
      }
    }
    else {
      next()
    }
  })
}
