import { defineConfig, mergeConfig } from 'vitest/config';
import { createAireadyVitestAliases } from '../../vitest-aliases';
import baseConfig from '../../vitest.base.config';

export default defineConfig(
  mergeConfig(baseConfig, {
    test: {
      globals: true,
      environment: 'node',
      alias: createAireadyVitestAliases(__dirname, {
        packagesRootRelative: '..',
        useIndexEntrypoints: true,
      }),
      exclude: [
        '**/node_modules/**',
        '**/dist/**',
        '**/cypress/**',
        '**/.{idea,git,cache,output,temp}/**',
      ],
      coverage: {
        exclude: [
          'coverage/**',
          'dist/**',
          '**/*.d.ts',
          '**/*.config.*',
          '**/__tests__/**',
        ],
      },
    },
  })
);
