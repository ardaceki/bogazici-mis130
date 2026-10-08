import { test, expect } from './fixtures.js';

test('R prepares on opening an editor, shares initialization and never runs code automatically', async ({
  page,
}) => {
  await page.goto('/');
  expect(await page.evaluate(() => window.workshop.runtime.ready)).toBe(null);
  await page.goto('/#paper-matrix');
  expect(await page.evaluate(() => window.workshop.runtime.ready)).toBe(null);
  await page.goto('/#first-calculation');
  await expect(page.getByRole('textbox', { name: 'R code editor' })).toBeEditable();
  await page.evaluate(async () => {
    await window.workshop.runtime.ready;
  });
  expect(await page.evaluate(() => !!window.workshop.runtime.engine)).toBe(true);
  expect(await page.evaluate(() => window.workshop.runtime.env)).toBe(null);
  await expect(page.locator('#feedback')).toBeEmpty();
  await page.getByRole('textbox', { name: 'R code editor' }).fill('1 + 1');
  const generation = await page.evaluate(() => window.workshop.runtime.generation);
  await page.getByRole('button', { name: 'Run', exact: true }).click();
  await expect(page.locator('#feedback')).toContainText('Correct.', { timeout: 90000 });
  expect(await page.evaluate(() => window.workshop.runtime.generation)).toBe(generation);
  await page.screenshot({ path: 'tests/artifacts/preloaded-r-mobile.png', fullPage: false });
});

test('a failed warm-up does not block editing and Run can retry', async ({ page }) => {
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.route('https://webr.r-wasm.org/**', (route) => route.abort());
  await page.goto('/#first-calculation');
  await expect(page.locator('#runtime-status')).toHaveText('R could not load', { timeout: 30000 });
  await page.getByRole('textbox', { name: 'R code editor' }).fill('1 + 1');
  await expect(page.getByRole('button', { name: 'Run', exact: true })).toBeEnabled();
  await page.unroute('https://webr.r-wasm.org/**');
  await page.getByRole('button', { name: 'Run', exact: true }).click();
  await expect(page.locator('#feedback')).toContainText('Correct.', { timeout: 90000 });
  expect(errors).toEqual([]);
});
