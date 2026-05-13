import { FlatCompat } from '@eslint/eslintrc';
import { fileURLToPath } from 'url';
import path from 'path';
import globals from 'globals';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const compat = new FlatCompat({ baseDirectory: __dirname });

export default [
  ...compat.extends('airbnb'),
  {
    files: ['frontend/src/**/*.{js,jsx}'],
    languageOptions: {
      globals: globals.browser,
    },
    rules: {
      'react/react-in-jsx-scope': 'off',
      'react/jsx-filename-extension': ['warn', { extensions: ['.jsx'] }],
      'import/extensions': ['error', 'ignorePackages', {
        js: 'always',
        jsx: 'never',
      }],
      'jsx-a11y/label-has-associated-control': ['error', { assert: 'either' }],
      'react/jsx-props-no-spreading': 'off',
    },
  },
  {
    files: ['backend/src/**/*.js'],
    languageOptions: {
      globals: globals.node,
      sourceType: 'module',
      ecmaVersion: 'latest',
    },
    rules: {
      'no-console': 'off',
      'import/extensions': ['error', 'always'],
    },
  },
  {
    files: ['**/*.test.{js,jsx}', '**/setupTests.js'],
    rules: {
      'import/no-extraneous-dependencies': ['error', { devDependencies: true }],
    },
  },
  {
    ignores: ['node_modules/**', 'backend/uploads/**'],
  },
];
