import type { Router } from 'vue-router'
import { useAuthStoreWithout } from '@/store/modules/auth'

export function setupPageGuard(router: Router) {
  router.beforeEach(async (from, to, next) => {
    const authStore = useAuthStoreWithout()

    if (!authStore.config) {
      try {
        const data = await authStore.fetchConfig()
        if (data.authorized === '1') {
          if (authStore.token) {
            next()
          }
          else {
            if (from.path !== '/403')
              next({ name: '403' })
            else
              next()
          }
        }
        else {
          next()
        }
      }
      catch {
        if (from.path !== '/500')
          router.push({ name: '500' })
        else
          next()
      }
    }
    else {
      if (authStore.config.authorized === '1') {
        if (authStore.token) {
          next()
        }
        else {
          if (from.path !== '/403')
            next({ name: '403' })
          else
            next()
        }
      }
      else {
        next()
      }
    }
  })

  router.afterEach(() => {
    //
  })
}
