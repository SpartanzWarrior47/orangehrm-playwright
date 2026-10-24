import { test, expect } from '@playwright/test';

test('User starts with an authenticated session @smoke', async ({ page }) => {
    await page.goto('/');

    await expect(
        page.getByRole('heading', { name: 'Dashboard' })
    ).toBeVisible();
});