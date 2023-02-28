import path from 'path'
import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import { createSvgIconsPlugin } from "vite-plugin-svg-icons";
import DefineOptions from "unplugin-vue-define-options/vite";

export default defineConfig((env) => {
	const viteEnv = loadEnv(env.mode, process.cwd()) as unknown as ImportMetaEnv

	return {
		resolve: {
			alias: {
				'@': path.resolve(process.cwd(), 'src'),
			},
		},
		plugins: [
			vue(),
			DefineOptions(),
			createSvgIconsPlugin({
				iconDirs: [path.resolve(process.cwd(), "src/icons")],
				symbolId: "icon-[dir]-[name]",
				inject: "body-last",
				customDomId: "__SVG_ICON_LOCAL__",
			})
		],
		server: {
			host: '0.0.0.0',
			port: 1002,
			open: false,
			proxy: {
				'/api': {
					target: viteEnv.VITE_APP_API_BASE_URL,
					changeOrigin: true, // 允许跨域
					rewrite: path => path.replace('/api/', '/'),
				},
			},
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
