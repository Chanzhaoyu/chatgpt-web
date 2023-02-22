import type { ProxyOptions } from 'vite'

export function createViteProxy(isOpenProxy: boolean, viteEnv: ImportMetaEnv) {
  if (!isOpenProxy)
    return

  const proxy: Record<string, string | ProxyOptions> = {
    '/api': {
      target: viteEnv.VITE_GLOB_API_URL,
      changeOrigin: true,
      rewrite: path => path.replace('/api/', '/'),
    },
  }

  return proxy
}
