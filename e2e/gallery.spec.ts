import { test, expect } from '@playwright/test';

// Visual-regression snapshots of the component-kit gallery in both themes.
// Baselines are committed by CI (Linux). See .github/workflows/visual.yml.

test('gallery renders in dark theme', async ({ page }) => {
  await page.goto('/studio/gallery');
  await page.locator('.gallery').waitFor();
  await expect(page).toHaveScreenshot('gallery-dark.png', { fullPage: true });
});

test('gallery renders in light theme', async ({ page }) => {
  await page.goto('/studio/gallery');
  await page.getByRole('button', { name: 'Light theme' }).click();
  await page.locator('[data-theme="light"]').waitFor();
  await expect(page).toHaveScreenshot('gallery-light.png', { fullPage: true });
});
