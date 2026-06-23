// This is a reusable configuration file copied from https://github.com/actions/reusable-workflows/tree/main/reusable-configurations. Please don't make changes to this file as it's the subject of an automatic update.
import tsPlugin from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import jest from 'eslint-plugin-jest';
import prettier from 'eslint-config-prettier';

export default [
  {
    ignores: ['**/node_modules/**', '**/lib/**', '**/dist/**', 'docs/**', '*.js', '*.mjs', '*.cjs']
  },
  {
    files: ['**/*.ts'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 2022,
        sourceType: 'module'
      }
    },
    plugins: {
      '@typescript-eslint': tsPlugin
    },
    rules: {
      ...tsPlugin.configs.recommended.rules,
      '@typescript-eslint/no-require-imports': 'error',
      '@typescript-eslint/no-non-null-assertion': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-empty-function': 'off',
      '@typescript-eslint/ban-ts-comment': [
        'error',
        {
          'ts-ignore': 'allow-with-description'
        }
      ],
      'no-console': 'error',
      'yoda': 'error',
      'prefer-const': [
        'error',
        {
          destructuring: 'all'
        }
      ],
      'no-control-regex': 'off',
      'no-constant-condition': ['error', {checkLoops: false}],
      '@typescript-eslint/no-unused-expressions': 'off',
      '@typescript-eslint/no-unused-vars': ['error', {varsIgnorePattern: '^_', argsIgnorePattern: '^_', ignoreRestSiblings: true, caughtErrors: 'none'}]
    }
  },
  {
    files: ['**/*{test,spec}.ts'],
    ...jest.configs['flat/recommended'],
    rules: {
      ...jest.configs['flat/recommended'].rules,
      '@typescript-eslint/no-unused-vars': 'off',
      'jest/no-standalone-expect': 'off',
      'jest/no-conditional-expect': 'off',
      'no-console': 'off'
    }
  },
  prettier
];
