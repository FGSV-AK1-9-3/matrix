import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: 'tests/',
  testMatch: 'scenic.spec.js',
  reporter: [['html'], ['list']],
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  webServer: {
    // Serve the repo root (one level up from the tests/ folder)
    command: 'npx serve . -p 3000 -s',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
});
