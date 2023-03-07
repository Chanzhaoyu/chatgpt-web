import type { Router } from 'vue-router'
import { useAuthStoreWithout } from '@/store/modules/auth'

export function setupPageGuard(router: Router) {
  router.beforeEach(async (from, to, next) => {
    const authStore = useAuthStoreWithout()
    if (!authStore.session) {
      const data = await authStore.getSession()
      if (String(data.auth) === 'false' && authStore.token)
        authStore.removeToken()
      next()
    }
    else {
      next()
    }
  })
}
