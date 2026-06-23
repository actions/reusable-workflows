import js from '@eslint/js';
import tsParser from '@typescript-eslint/parser';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import jest from 'eslint-plugin-jest';
import nodePlugin from 'eslint-plugin-n';
import prettier from 'eslint-config-prettier';
import globals from 'globals';

export default [
  {
    ignores: ['**/node_modules/**', '**/lib/**', '**/dist/**', 'docs/**', '*.js', '*.mjs', '*.cjs']
  },
  js.configs.recommended,
  {
    files: ['**/*.ts'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {ecmaVersion: 2022, sourceType: 'module'},
      globals: {...globals.node, ...globals.jest}
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
      n: nodePlugin
    },
    rules: {
      ...tsPlugin.configs.recommended.rules,
      'n/no-extraneous-import': 'error',
      '@typescript-eslint/no-require-imports': 'error',
      '@typescript-eslint/no-non-null-assertion': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-empty-function': 'off',
      '@typescript-eslint/ban-ts-comment': ['error', {'ts-ignore': 'allow-with-description'}],
      'no-console': 'error',
      yoda: 'error',
      'prefer-const': ['error', {destructuring: 'all'}],
      'no-control-regex': 'off',
      'no-constant-condition': ['error', {checkLoops: false}]
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
