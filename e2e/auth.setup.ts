import { test as setup } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

const authFile = 'playwright/.auth/user.json';

const DUMMY_AUTH_STORAGE = {
  state: {
    accessToken: 'e2e-test-access-token',
    user: {
      id: 'e2e-user',
      email: 'e2e@trendupp.test',
      firstName: 'E2E',
      lastName: 'Tester',
      role: 'creator',
      isEmailVerified: true,
      onboardingPercentage: 100,
      onboardingStepsCompleted: { profile: true, niches: true, socials: true, payout: true },
      socialsConnected: { instagram: false, tiktok: false, youtube: false, twitter: false },
      username: 'e2e_tester',
      niches: [],
      industries: [],
      assignedTier: 'Nano Creator',
      bio: null,
      avatarUrl: null,
      bankName: null,
      bankAccountNumber: null,
      bankAccountName: null,
      brandRepresentative: null,
    },
  },
  version: 0,
};

setup('authenticate', async ({ page }) => {
  // If running in CI or if mock auth is explicitly requested, generate a dummy session immediately
  if (
    process.env.CI ||
    process.env.PLAYWRIGHT_USE_MOCK_AUTH === 'true' ||
    !process.env.PLAYWRIGHT_USE_REAL_AUTH
  ) {
    const dir = path.dirname(authFile);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    const state = {
      cookies: [],
      origins: [
        {
          origin: process.env.PLAYWRIGHT_BASE_URL ?? 'http://localhost:3001',
          localStorage: [
            {
              name: 'trendupp-auth',
              value: JSON.stringify(DUMMY_AUTH_STORAGE),
            },
          ],
        },
      ],
    };
    fs.writeFileSync(authFile, JSON.stringify(state, null, 2));
    console.log('Automated mock authentication state generated.');
    return;
  }

  // Otherwise, run manual login flow on local machines
  await page.goto('/signin');

  // Click Google Sign-in button
  const googleBtn = page.locator('button[aria-label="Sign in with Google"]').first();
  await googleBtn.click();

  console.log('--- MANUAL GOOGLE OAUTH LOGIN REQUIRED ---');
  console.log('Please log in manually on the browser window that popped up.');
  console.log(
    'Once you are redirected to the dashboard, click "Resume" in the Playwright inspector.',
  );

  // Pause browser execution so user can log in manually
  await page.pause();

  // Save the logged-in state (cookies + localStorage)
  await page.context().storageState({ path: authFile });
});
