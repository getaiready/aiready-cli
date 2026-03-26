import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';

/** @type {import('eslint').Linter.Config[]} */
const eslintConfig = [
  {
    ignores: [
      '.next/**',
      '.open-next/**',
      '.sst/**',
      'out/**',
      'build/**',
      'next-env.d.ts',
      'sst-env.d.ts',
      'monitor/sst-env.d.ts',
    ],
  },
  ...nextVitals,
  ...nextTs,
  {
    rules: {
      'react/no-unescaped-entities': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],
      '@typescript-eslint/no-require-imports': 'off',
      '@typescript-eslint/ban-ts-comment': 'off',
      '@typescript-eslint/triple-slash-reference': 'off',
      'no-useless-escape': 'warn',
      'no-empty': 'warn',
      'no-useless-assignment': 'warn',
      '@next/next/no-img-element': 'off',
    },
    settings: {
      react: {
        version: '19.0.0',
      },
    },
  },
];

export default eslintConfig;
