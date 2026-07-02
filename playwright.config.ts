import { defineConfig, devices } from '@playwright/test';

const authFile = 'playwright/.auth/user.json';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [['html', { outputFolder: 'playwright-report' }]],

  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL ?? 'http://localhost:3001',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },

  projects: [
    // 1. Authentication setup step
    {
      name: 'setup',
      testMatch: /auth\.setup\.ts/,
    },
    // 2. Chromium testing
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        storageState: authFile,
      },
      dependencies: ['setup'],
    },
    // 3. Firefox/Webkit testing (skipped in CI to keep pipeline lean)
    ...(!process.env.CI
      ? [
          {
            name: 'firefox',
            use: {
              ...devices['Desktop Firefox'],
              storageState: authFile,
            },
            dependencies: ['setup'],
          },
          {
            name: 'webkit',
            use: {
              ...devices['Desktop Safari'],
              storageState: authFile,
            },
            dependencies: ['setup'],
          },
        ]
      : []),
  ],

  webServer: {
    command: process.env.CI ? 'npm run build && npx next start -p 3001' : 'npx next dev -p 3001',
    url: 'http://localhost:3001',
    reuseExistingServer: !process.env.CI,
    timeout: 120000,
    env: {
      NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET ?? 'e2e-test-secret-not-for-production',
      NEXTAUTH_URL: process.env.NEXTAUTH_URL ?? 'http://localhost:3001',
      GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID ?? 'e2e-dummy-google-client-id',
      GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET ?? 'e2e-dummy-google-client-secret',
      NEXT_PUBLIC_TIKTOK_CLIENT_KEY:
        process.env.NEXT_PUBLIC_TIKTOK_CLIENT_KEY ?? 'e2e-dummy-tiktok-key',
      NEXT_PUBLIC_INSTAGRAM_APP_ID:
        process.env.NEXT_PUBLIC_INSTAGRAM_APP_ID ?? 'e2e-dummy-instagram-app-id',
    },
  },
});
