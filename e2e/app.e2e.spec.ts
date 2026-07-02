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
    expect(page.url()).toContain('localhost');
  });

  test('help & support drawer opens and handles ticket submission', async ({ page }) => {
    await page.goto('/creator/profile');
    // Ensure the page is fully loaded before interacting
    await page.waitForLoadState('networkidle');

    // Click settings tab trigger
    // Wait for settings tab to be present and visible
    await page.waitForSelector('#tab-trigger-settings', { state: 'visible', timeout: 10000 });
    const settingsTab = page.locator('#tab-trigger-settings');
    await settingsTab.click();

    // Check that settings item for help exists and click it
    const helpBtn = page.locator('#settings-item-help');
    await expect(helpBtn).toBeVisible();
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
