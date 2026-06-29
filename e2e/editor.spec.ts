import { test, expect } from '@playwright/test';

// Functional smoke test (no snapshot): proves the editor shell loads, the
// Explorer reads the real filesystem, and opening a file mounts Monaco —
// the end-to-end path that jsdom unit tests can't exercise.
test('opens a file from the Explorer into the Monaco editor', async ({ page }) => {
  await page.goto('/studio');

  // Explorer tree loads from the API.
  await page.locator('[role="tree"]').waitFor();

  // Expand the views directory, then open welcome.blade.php inside it.
  await page.getByText('views', { exact: true }).click();
  const file = page.getByText('welcome.blade.php', { exact: true });
  await file.waitFor();
  await file.click();

  // Switch the canvas to the Code view, where Monaco edits the file.
  await page.getByRole('tab', { name: 'Code' }).click();

  // Monaco mounts and the editor bar shows the opened file's path.
  await expect(page.locator('.monaco-editor')).toBeVisible({ timeout: 15000 });
  await expect(page.getByText('views/welcome.blade.php')).toBeVisible();
});
