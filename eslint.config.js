import { tanstackConfig } from '@tanstack/eslint-config'

export default [
  {
    ignores: ['eslint.config.js'],
    rules: {
      'no-unused-vars': [
        'error',
        {
          vars: 'all',
          args: 'after-used',
          argsIgnorePattern: '^_',
          caughtErrors: 'all',
          caughtErrorsIgnorePattern: '^_',
          ignoreRestSiblings: false,
          reportUsedIgnorePattern: false,
        },
      ],
    },
  },
  ...tanstackConfig,
]
