import { defineConfig } from 'vitest/config';
import path from 'path';
import { fileURLToPath } from 'url';

const dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['src/**/*.test.ts', 'test/**/*.test.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json-summary'],
      include: [
        'src/context-builder.ts',
        'src/engine.ts',
        'src/path-utils.ts',
        'src/prompts.ts',
        'src/prompt-choices.ts',
        'src/writer.ts',
        'src/adapters/**/*.ts',
      ],
      exclude: ['src/**/*.test.ts', '**/node_modules/**'],
      thresholds: {
        lines: 100,
        functions: 100,
        branches: 100,
        statements: 100,
      },
    },
  },
  root: dirname,
});
