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

  test('can apply for a campaign successfully', async ({ page }) => {
    // 1. Mock campaigns endpoint
    await page.route('**/api/v1/campaigns', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          data: [
            {
              id: '9260e2fb-f229-4740-a779-1f939b810067',
              title: 'Summer Style Collection 2025',
              totalBudget: 300000,
              timeline: '2026-07-31T23:59:59.999Z',
              status: 'live',
              creatorCategory: {
                name: 'Micro',
              },
              preferredPlatforms: [
                {
                  id: 'instagram-platform-id',
                  name: 'Instagram',
                },
              ],
            },
          ],
        }),
      });
    });

    // 2. Mock campaign details endpoint
    await page.route('**/api/v1/campaigns/9260e2fb-f229-4740-a779-1f939b810067', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          id: '9260e2fb-f229-4740-a779-1f939b810067',
          title: 'Summer Style Collection 2025',
          totalBudget: 300000,
          timeline: '2026-07-31T23:59:59.999Z',
          status: 'live',
          creatorCategory: {
            name: 'Micro',
          },
          preferredPlatforms: [
            {
              id: 'instagram-platform-id',
              name: 'Instagram',
            },
          ],
          campaignBrief: 'Brief description of the summer collection.',
          deliverables: ['1x Instagram Reel'],
          contentDirection: ['A creative before-and-after dynamic style transition.'],
          contentGuidelines: {
            dos: ['Use high-quality vertical video format.'],
            donts: ['Do not show competing brands.'],
          },
          usageRights: '1-year digital usage rights.',
          successLooksLike: 'High engagement and style inspiration comments.',
        }),
      });
    });

    // 3. Mock platforms endpoint
    await page.route('**/api/v1/campaigns/platforms', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([
          {
            id: 'instagram-platform-id',
            name: 'Instagram',
          },
        ]),
      });
    });

    // 4. Mock apply endpoint
    await page.route(
      '**/api/v1/campaigns/9260e2fb-f229-4740-a779-1f939b810067/applications',
      async (route) => {
        await route.fulfill({
          status: 201,
          contentType: 'application/json',
          body: JSON.stringify({
            message: 'Application submitted successfully',
            application: {
              id: 'app-987',
            },
          }),
        });
      },
    );

    // Navigate to Creator Dashboard
    await page.goto('/creator/dashboard');
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.waitForLoadState('networkidle');

    // Click on the campaign card to open drawer
    const campaignCard = page
      .locator('text=Summer Style Collection 2025')
      .filter({ visible: true })
      .first();
    await expect(campaignCard).toBeVisible({ timeout: 10000 });
    await campaignCard.click();

    // Verify drawer opens
    const drawerTitle = page.locator('h3:has-text("Summer Style Collection 2025")').first();
    await expect(drawerTitle).toBeVisible();

    // Click "Apply" button inside drawer
    const applyBtn = page.locator('.auth-scrollbar button:has-text("Apply")').first();
    await expect(applyBtn).toBeVisible();
    await applyBtn.click();

    // Fill application form
    const ideaInput = page.locator('#contentTitle');
    await expect(ideaInput).toBeVisible();
    await ideaInput.fill(
      'This is my creative content idea concept that has more than twenty characters.',
    );

    const feeInput = page.locator('input[placeholder="Enter amount"]');
    await expect(feeInput).toBeVisible();
    await feeInput.fill('150000');

    // Click Submit Application
    const submitBtn = page.locator('.auth-scrollbar button:has-text("Submit Application")').first();
    await expect(submitBtn).toBeVisible();
    await submitBtn.click();

    // Verify success view
    const successTitle = page.locator('h3:has-text("You\'re in the running!")').first();
    await expect(successTitle).toBeVisible();
  });

  test('formats camelCase validation error messages from API', async ({ page }) => {
    // 1. Mock campaigns list
    await page.route('**/api/v1/campaigns', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          data: [
            {
              id: '9260e2fb-f229-4740-a779-1f939b810067',
              title: 'Summer Style Collection 2025',
              totalBudget: 300000,
              timeline: '2026-07-31T23:59:59.999Z',
              status: 'live',
              creatorCategory: { name: 'Micro' },
              preferredPlatforms: [{ id: 'instagram-platform-id', name: 'Instagram' }],
            },
          ],
        }),
      });
    });

    // 2. Mock campaign details
    await page.route('**/api/v1/campaigns/9260e2fb-f229-4740-a779-1f939b810067', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          id: '9260e2fb-f229-4740-a779-1f939b810067',
          title: 'Summer Style Collection 2025',
          totalBudget: 300000,
          timeline: '2026-07-31T23:59:59.999Z',
          status: 'live',
          creatorCategory: { name: 'Micro' },
          preferredPlatforms: [{ id: 'instagram-platform-id', name: 'Instagram' }],
          campaignBrief: 'Brief description.',
        }),
      });
    });

    // 3. Mock platforms list
    await page.route('**/api/v1/campaigns/platforms', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([{ id: 'instagram-platform-id', name: 'Instagram' }]),
      });
    });

    // 4. Mock apply endpoint returning validation error
    await page.route(
      '**/api/v1/campaigns/9260e2fb-f229-4740-a779-1f939b810067/applications',
      async (route) => {
        await route.fulfill({
          status: 400,
          contentType: 'application/json',
          body: JSON.stringify({
            message: 'pastWorkLink must be a valid URL',
            error: 'Bad Request',
            statusCode: 400,
          }),
        });
      },
    );

    // Navigate to Creator Dashboard
    await page.goto('/creator/dashboard');
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.waitForLoadState('networkidle');

    // Click on campaign card
    const campaignCard = page
      .locator('text=Summer Style Collection 2025')
      .filter({ visible: true })
      .first();
    await campaignCard.click();

    // Click Apply
    await page.locator('.auth-scrollbar button:has-text("Apply")').first().click();

    // Fill form
    await page
      .locator('#contentTitle')
      .fill('This is my creative content idea concept that has more than twenty characters.');
    await page.locator('input[placeholder="Enter amount"]').fill('150000');
    await page.locator('#workLink').fill('not-a-valid-url');

    // Submit
    await page.locator('.auth-scrollbar button:has-text("Submit Application")').first().click();

    // Verify toast shows formatted message
    const toastMessage = page.locator('text=Past work link must be a valid URL').first();
    await expect(toastMessage).toBeVisible({ timeout: 5000 });
  });
});
