import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/cli.ts'],
  format: ['esm'],
  target: 'es2022',
  clean: true,
  dts: true,
  bundle: true,
  minify: false,
  sourcemap: true,
});
