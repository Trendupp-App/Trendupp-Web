import { test, expect } from '@playwright/test';

test.describe('App smoke test', () => {
  test.beforeEach(async ({ page }) => {
    const isMock = process.env.CI || !process.env.PLAYWRIGHT_USE_REAL_AUTH;
    if (isMock) {
      // Mock nationalities
      await page.route('**/users/onboarding/nationalities', async (route) => {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify([]),
        });
      });

      // Mock countries
      await page.route('**/users/onboarding/countries', async (route) => {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify([]),
        });
      });

      // Mock niches
      await page.route('**/users/onboarding/niches', async (route) => {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify([]),
        });
      });

      // Mock support ticket categories
      await page.route('**/api/v1/profile/support-ticket/categories', async (route) => {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            categories: ['General Support', 'Payment Issue', 'Bug Report', 'Feedback'],
          }),
        });
      });

      // Mock support ticket submission
      await page.route('**/api/v1/profile/support-ticket', async (route) => {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            message: 'Ticket submitted successfully',
            ticket: {
              id: 'e2e-ticket-123',
              category: 'General Support',
              subject: 'Test subject',
              description: 'Test description',
              status: 'open',
              createdAt: new Date().toISOString(),
            },
          }),
        });
      });
    }

    // Mock generic profile API endpoints to avoid 401 redirects
    await page.route('**/api/v1/profile/**', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({}),
      });
    });
    // Mock auth user endpoint used by Zustand store
    await page.route('**/api/v1/users/me', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          id: 'user-123',
          email: 'test@example.com',
          name: 'Test User',
        }),
      });
    });
    // End of mocking block
  });

  test('homepage loads successfully', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/trendupp/i);
  });

  test('help & support drawer opens and handles ticket submission', async ({ page }) => {
    await page.goto('/creator/profile');
    // Set a desktop viewport to ensure tab bar is rendered
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.waitForLoadState('networkidle');

    // If a hamburger menu is present (mobile layout), open it
    const hamburger = page.locator('#hamburger-menu');
    if (await hamburger.isVisible()) {
      await hamburger.click();
    }

    // Ensure the tab navigation bar is visible and contains the three main tabs
    const tabBar = page.locator('#tab-nav-bar');
    await expect(tabBar).toBeVisible({ timeout: 30000 });
    await expect(tabBar.locator('button')).toHaveCount(3, { timeout: 30000 });

    // Click the Settings tab by its accessible name
    const settingsTab = tabBar.getByRole('button', { name: /settings/i }).first();
    await settingsTab.click();

    // Wait for the Help item in Settings to be visible and click it once
    const helpBtn = page.locator('#settings-item-help');
    await expect(helpBtn).toBeVisible({ timeout: 30000 });
    await helpBtn.click();

    // Check email info is visible (verifies the main help view is loaded)
    const emailInfo = page.locator('text=trendupp@gmail.com').first();
    await expect(emailInfo).toBeVisible();

    // Click the "Submit a Ticket" card to open form
    const ticketCard = page.locator('text=Submit a Ticket').first();
    await expect(ticketCard).toBeVisible();
    await ticketCard.click();

    // Check ticket instruction text is visible
    const descText = page.locator('text=Describe your issue below.').first();
    await expect(descText).toBeVisible();

    // Fill in the form inputs
    const subjectInput = page.locator('input[placeholder="Brief summary of your issue"]');
    await expect(subjectInput).toBeVisible();
    await subjectInput.fill('Test ticket subject');

    const descInput = page.locator('textarea[placeholder*="Please provide as much detail"]');
    await expect(descInput).toBeVisible();
    await descInput.fill('Test ticket description text detailing the issue.');

    // Dismiss the success alert and submit the ticket
    page.once('dialog', (dialog) => dialog.dismiss());
    const submitBtn = page.locator('button:has-text("Submit")').first();
    await expect(submitBtn).toBeVisible();
    await submitBtn.click();
  });
});
