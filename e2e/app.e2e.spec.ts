import { test, expect } from '@playwright/test';

/**
 * Smoke test  verifies the app loads and the root page is reachable.
 * This is the minimal E2E validation to confirm Playwright is wired up.
 */
test.describe('App smoke test', () => {
  test('homepage loads successfully', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/.+/);
    expect(page.url()).toContain('localhost');
  });
});
