import { test, expect } from './fixtures.js';

test('code survives returning through home without adding persistent storage', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/#first-calculation');
  await page.getByRole('textbox', { name: 'R code editor' }).fill('2 + 2');
  await page.locator('.brand').click();
  await page.locator('[data-open-mode="learn"]').click();
  await expect(page.getByRole('textbox', { name: 'R code editor' })).toHaveText('2 + 2');
  await page.screenshot({ path: 'tests/artifacts/preserved-draft-mobile.png', fullPage: false });
  await expect(
    page.locator('#download-code, #reset-code, #reference-open, #reference-dialog'),
  ).toHaveCount(0);
  expect(
    await page.evaluate(() => ({ local: localStorage.length, session: sessionStorage.length })),
  ).toEqual({ local: 0, session: 0 });
  await page.reload();
  await expect(page.getByRole('textbox', { name: 'R code editor' })).toHaveText('1 + 1');
});

test('returning home cancels a running R task and preserves an editable draft', async ({
  page,
}) => {
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto('/#first-calculation');
  const editor = page.getByRole('textbox', { name: 'R code editor' });
  await editor.fill('1 + 1');
  await page.getByRole('button', { name: 'Run', exact: true }).click();
  await expect(page.locator('#feedback')).toContainText('Correct.', { timeout: 90000 });
  await editor.fill('while (TRUE) {}');
  await page.getByRole('button', { name: 'Run', exact: true }).click();
  await expect(page.locator('#runtime-status')).toHaveText('Running…');
  await page.locator('.brand').click();
  await expect(page.locator('#start-screen')).toBeVisible();
  expect(await page.evaluate(() => window.workshop.busy)).toBe(false);
  await page.locator('[data-open-mode="learn"]').click();
  await expect(editor).toHaveText('while (TRUE) {}');
  await expect(page.getByRole('button', { name: 'Run', exact: true })).toBeEnabled();
  await expect(page.locator('#feedback')).toBeEmpty();
  await editor.fill('1 + 1');
  await page.getByRole('button', { name: 'Run', exact: true }).click();
  await expect(page.locator('#feedback')).toContainText('Correct.', { timeout: 90000 });
  expect(errors).toEqual([]);
});
