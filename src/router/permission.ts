import type { Router } from 'vue-router'
import { ROUTER } from './const'
import { useAuthStoreWithout } from '@/store/modules/auth'

export function setupPageGuard(router: Router) {
  router.beforeEach(async (to, from, next) => {
    const authStore = useAuthStoreWithout()
    if (!authStore.session) {
      try {
        const data = await authStore.getSession()
        if (String(data.auth) === 'false' && authStore.token)
          authStore.removeToken()
        if (to.path === '/500')
          next({ name: ROUTER.name.root })
        else
          next()
      }
      catch (error) {
        if (to.path !== '/500')
          next({ name: ROUTER.name.exception500 })
        else
          next()
      }
    }
    else {
      next()
    }
  })
}
