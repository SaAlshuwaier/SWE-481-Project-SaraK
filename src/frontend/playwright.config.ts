import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  timeout: 30000,
  retries: 1,
  fullyParallel: true,

  projects: [
    {
      name: 'setup',
      testMatch: /auth\.setup\.ts/,
    },
    {
      name: 'chromium',
      dependencies: ['setup'],
      use: {
        ...devices['Desktop Chrome'],
        storageState: 'playwright/.auth/user.json',
      },
      testMatch: /e2e\.spec\.ts/,
    },
    {
      name: 'firefox',
      dependencies: ['setup'],
      use: {
        ...devices['Desktop Firefox'],
        storageState: 'playwright/.auth/user.json',
      },
      testMatch: /e2e\.spec\.ts/,
    },
    {
      name: 'webkit',
      dependencies: ['setup'],
      use: {
        ...devices['Desktop Safari'],
        storageState: 'playwright/.auth/user.json',
      },
      testMatch: /e2e\.spec\.ts/,
    },
  ],
});