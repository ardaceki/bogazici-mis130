import { test, expect } from './fixtures.js';

test('a beginner sees one action and learns addition before multiplication', async ({ page }) => {
  await page.goto('/#first-calculation');
  await expect(page.locator('.sidebar')).not.toBeVisible();
  await expect(page.locator('.results-pane')).not.toBeVisible();
  await expect(page.locator('.prompt')).toHaveText(
    'The code is ready. Click Run to add these two numbers.',
  );
  await expect(page.locator('button.primary-button:visible')).toHaveCount(1);
  await page.screenshot({ path: 'tests/artifacts/guided-first.png', fullPage: true });
  await page.getByRole('button', { name: 'Run', exact: true }).click();
  await expect(page.locator('#feedback')).toContainText('The answer is 2.', { timeout: 90000 });
  await expect(page.locator('#output-panel')).toContainText('[1] 2');
  await expect(page.locator('.task-footer .next')).toHaveText('Continue →');
  await page.locator('.task-footer .next').click();
  await expect(page.locator('#task-heading')).toHaveText('Change one number');
  await page.evaluate(() => window.workshop.setEditor('1 + 2'));
  await page.getByRole('button', { name: 'Run', exact: true }).click();
  await expect(page.locator('#feedback')).toContainText('1 + 2 gives 3.');
  await page.locator('.task-footer .next').click();
  await expect(page.locator('#task-heading')).toHaveText('Multiply two numbers');
});

test('multi-part learning tasks show one operation at a time; all tasks remain open', async ({
  page,
}) => {
  await page.goto('/#assignment');
  await expect(page.locator('#task-position')).toHaveText('Step 1 of 3');
  await page.getByRole('button', { name: 'Run', exact: true }).click();
  await expect(page.locator('#feedback')).toContainText('ticket_price now holds 40.', {
    timeout: 90000,
  });
  await page.getByRole('button', { name: 'Continue →', exact: true }).click();
  await expect(page.locator('#task-position')).toHaveText('Step 2 of 3');
  await expect(page.locator('.prompt')).toHaveText('Add a new line: ticket_count <- 3.');
  await page.evaluate(() => window.workshop.setEditor('ticket_price <- 40\nticket_count <- 3'));
  await page.getByRole('button', { name: 'Run', exact: true }).click();
  await expect(page.locator('#feedback')).toContainText('two named values');
  await page.getByRole('button', { name: 'Continue →', exact: true }).click();
  await expect(page.locator('#task-position')).toHaveText('Step 3 of 3');
  await page.getByRole('button', { name: 'Open course navigation' }).click();
  await expect(page.locator('#task-nav a')).not.toHaveCount(0);
  await page.keyboard.press('Escape');
  await page.goto('/#lab3-departments');
  await expect(page.locator('#task-heading')).toContainText('Department performance');

  await page.getByRole('button', { name: 'Show solution', exact: true }).click();
  await expect(page.locator('#solution')).toContainText('rowMeans');
  await page.setViewportSize({ width: 390, height: 844 });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.goto('/#first-calculation');
  await page.screenshot({ path: 'tests/artifacts/guided-mobile.png', fullPage: true });
});
