import { test, expect } from '@playwright/test';

test.describe('App smoke test', () => {
  test('homepage loads successfully', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/trendupp/i);
    expect(page.url()).toContain('localhost');
  });

  test('help & support drawer opens and handles ticket submission', async ({ page }) => {
    await page.goto('/creator/profile');

    // Click settings tab trigger
    const settingsTab = page.locator('#tab-trigger-settings');
    await expect(settingsTab).toBeVisible();
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
    page.once('dialog', async (dialog) => {
      await dialog.dismiss();
    });
    const submitBtn = page.locator('button:has-text("Submit")').first();
    await expect(submitBtn).toBeVisible();
    await submitBtn.click();
  });
});
