import path from 'path'
import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import { createViteProxy } from './config'

export default defineConfig((env) => {
  const viteEnv = loadEnv(env.mode, process.cwd()) as unknown as ImportMetaEnv

  const isOpenProxy = viteEnv.VITE_GLOB_HTTP_PROXY === 'Y'

  return {
    resolve: {
      alias: {
        '@': path.resolve(process.cwd(), 'src'),
      },
    },
    plugins: [vue()],
    server: {
      host: '0.0.0.0',
      port: 1002,
      open: false,
      proxy: createViteProxy(isOpenProxy, viteEnv),
    },
    build: {
      reportCompressedSize: false,
      sourcemap: false,
      commonjsOptions: {
        ignoreTryCatch: false,
      },
    },
  }
})
