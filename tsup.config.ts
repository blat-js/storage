import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  sourcemap: false,
  clean: true,
  minify: true,
  bundle: false,
  splitting: false,
  format: 'esm',
  target: 'es2018',
  esbuildPlugins: [],
  dts: true,
});
