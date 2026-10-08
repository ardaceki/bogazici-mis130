import { test, expect } from './fixtures.js';

test('hint and solution controls retain keyboard focus after updating content', async ({
  page,
}) => {
  await page.goto('/#first-calculation');
  await page.locator('#hint-button').focus();
  await page.locator('#hint-button').press('Enter');
  await expect(page.locator('#hints')).not.toBeEmpty();
  await expect(page.locator('#hint-button')).toBeFocused();
  await page.locator('#solution-button').focus();
  await page.locator('#solution-button').press('Enter');
  await expect(page.locator('#solution')).toBeVisible();
  await expect(page.locator('#solution-button')).toBeFocused();
  await page.locator('#hint-button').click();
  await expect(page.locator('#solution')).not.toHaveClass(/is-new/);
  await page.locator('#solution-button').focus();
  await page.locator('#solution-button').press('Enter');
  await expect(page.locator('#solution')).toHaveCount(0);
  await expect(page.locator('#solution-button')).toBeFocused();
});
