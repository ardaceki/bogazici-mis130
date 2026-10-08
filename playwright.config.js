import { defineConfig } from '@playwright/test';
export default defineConfig({
  testDir: './tests',
  timeout: 240000,
  globalTimeout: 15 * 60 * 1000,
  forbidOnly: !!process.env.CI,
  fullyParallel: false,
  workers: 1,
  use: {
    baseURL: 'http://127.0.0.1:5174',
    ...(process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE
      ? { launchOptions: { executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE } }
      : process.env.CI
        ? {}
        : { channel: 'chrome' }),
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
  },
  reporter: process.env.CI ? [['list'], ['html', { open: 'never' }]] : [['list']],
  webServer: {
    command: 'npm run dev -- --mode test --port 5174 --strictPort',
    url: 'http://127.0.0.1:5174',
    reuseExistingServer: false,
  },
});
