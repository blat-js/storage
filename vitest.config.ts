import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['src/**/*.test.ts'],
    silent: false,
    coverage: {
      include: ['src/**/*.ts'],
    },
  },
});
