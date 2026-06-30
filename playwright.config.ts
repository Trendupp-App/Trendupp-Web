import { defineConfig, devices } from '@playwright/test';

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

  projects: process.env.CI
    ? [
        // In CI only Chromium is installed — keep the pipeline lean.
        { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
      ]
    : [
        // Full cross-browser suite when running locally.
        { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
        { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
        { name: 'webkit', use: { ...devices['Desktop Safari'] } },
      ],

  webServer: {
    command: process.env.CI ? 'npm run build && npx next start -p 3001' : 'npx next dev -p 3001',
    url: 'http://localhost:3001',
    reuseExistingServer: !process.env.CI,
    timeout: 120000,
    // NextAuth v4 hard-requires a secret when running a production server
    // (`next start`), which is what CI uses. These are TEST-ONLY placeholders so
    // the e2e web server boots past NO_SECRET — NEVER put real secrets here, this
    // file is committed to git. Real values come from CI secrets (ci.yml `env:`
    // referencing `${{ secrets.* }}`) and Vercel env vars at deploy time, which
    // override these fallbacks when present.
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
