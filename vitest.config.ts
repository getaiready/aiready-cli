import { defineConfig } from 'vitest/config';
import { resolve } from 'path';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    alias: {
      '@aiready/core': resolve(__dirname, '../core/src/index.ts'),
      '@aiready/pattern-detect': resolve(
        __dirname,
        '../pattern-detect/src/index.ts'
      ),
      '@aiready/context-analyzer': resolve(
        __dirname,
        '../context-analyzer/src/index.ts'
      ),
    },
  },
});
