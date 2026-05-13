import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    projects: [
      {
        plugins: [react()],
        test: {
          name: 'frontend',
          environment: 'jsdom',
          include: ['frontend/**/*.test.{js,jsx}'],
          setupFiles: ['./frontend/src/setupTests.js'],
          globals: true,
        },
      },
      {
        test: {
          name: 'backend',
          environment: 'node',
          include: ['backend/**/*.test.js'],
          globals: true,
        },
      },
    ],
  },
});
