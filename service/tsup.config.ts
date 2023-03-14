import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts'],
  outDir: 'build',
  target: 'es2020',
  format: ['cjs'],
  splitting: false,
  sourcemap: true,
  minify: false,
  shims: true,
  dts: false,
  noExternal: ["chatgpt", "socks-proxy-agent", "express", "https-proxy-agent", "node-fetch"],
})
