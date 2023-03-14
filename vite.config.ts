import path from 'path'
import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import { VitePWA } from 'vite-plugin-pwa'
// import legacy from '@vitejs/plugin-legacy'

export default defineConfig((env) => {
  const viteEnv = loadEnv(env.mode, process.cwd()) as unknown as ImportMetaEnv

  return {
    resolve: {
      alias: {
        '@': path.resolve(process.cwd(), 'src'),
      },
    },
    plugins: [
      // legacy({
      //   targets: ['defaults', 'last 2 UCAndroid version'],
      // }),
      vue(),
      VitePWA({
        injectRegister: 'auto',
        manifest: {
          name: 'chatGPT',
          short_name: 'chatGPT',
          icons: [
            { src: 'pwa-192x192.png', sizes: '192x192', type: 'image/png' },
            { src: 'pwa-512x512.png', sizes: '512x512', type: 'image/png' },
          ],
        },
      }),
    ],
    server: {
      host: '0.0.0.0',
      port: 1002,
      open: false,
      proxy: {
        '/web': {
          target: viteEnv.VITE_APP_API_BASE_URL,
          changeOrigin: true, // 允许跨域
          withCredentials: true,
          // rewrite: path => path.replace('/api/', '/'),
        },
      },
    },
    build: {
      target: 'es2015',
      reportCompressedSize: false,
      sourcemap: false,
      commonjsOptions: {
        ignoreTryCatch: false,
      },
    },
  }
})
