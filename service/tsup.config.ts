import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts'],
  outDir: 'build',
  target: 'es2020',
  format: ['esm'],
  splitting: false,
  sourcemap: true,
  minify: false,
  shims: true,
  dts: false,
})
