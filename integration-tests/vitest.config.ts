import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    alias: {
      '@aiready/cli': path.resolve(__dirname, '../packages/cli/src'),
      '@aiready/core': path.resolve(__dirname, '../packages/core/src'),
      '@aiready/pattern-detect': path.resolve(
        __dirname,
        '../packages/pattern-detect/src'
      ),
      '@aiready/context-analyzer': path.resolve(
        __dirname,
        '../packages/context-analyzer/src'
      ),
      '@aiready/consistency': path.resolve(
        __dirname,
        '../packages/consistency/src'
      ),
    },
  },
});
