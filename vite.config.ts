import path from 'path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'

export default defineConfig(() => {
  return {
    resolve: {
      alias: {
        '~': path.resolve(process.cwd()),
        '@': path.resolve(process.cwd(), 'src'),
      },
    },
    plugins: [vue(), vueJsx(), createSvgIconsPlugin({
      iconDirs: [path.resolve(process.cwd(), 'src/icons')],
      symbolId: 'icon-local-[dir]-[name]',
      inject: 'body-last',
      customDomId: '__svg__icons__dom__',
    })],
    server: {
      port: 1002,
      host: '0.0.0.0',
      open: false,
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
