import typescript from '@rollup/plugin-typescript'
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import json from '@rollup/plugin-json'
import terser from '@rollup/plugin-terser'

export default {
  input: 'src/index.ts',
  output: {
    file: 'build/index.mjs',
    sourcemap: true,
    format: 'esm',
    inlineDynamicImports: true,
  },
  context: 'global',
  external: ['@dqbd/tiktoken', 'uuid'],
  plugins: [
    resolve({
      preferBuiltins: true,
    }),
    json(),
    commonjs(),
    typescript(),
    terser(),
  ],
}
