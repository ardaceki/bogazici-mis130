import { test, expect } from '@playwright/test';

test('course attribution appears on arrival and remains available in the header', async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  const notice = page.getByRole('dialog', { name: 'About the course materials' });
  await expect(notice).toBeVisible();
  await expect(notice).toContainText('Fahrettin Çakır');
  await expect(notice).toContainText('independent student project');
  await expect(notice).not.toContainText(/permission|approved/i);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.getByRole('button', { name: 'Continue to workshop' }).click();
  await expect(notice).not.toBeVisible();
  await page.locator('[data-open-mode="learn"]').click();
  await expect(page.locator('#task-heading')).toBeVisible();
  await expect(notice).not.toBeVisible();
  await page.locator('#materials-header').click();
  await expect(notice).toBeVisible();
  await page.getByRole('button', { name: 'Close course materials notice' }).click();
  await expect(notice).not.toBeVisible();
  await page.getByRole('button', { name: 'About the course materials', exact: true }).click();
  await expect(notice).toBeVisible();
  await page.getByRole('button', { name: 'Close course materials notice' }).click();
  expect(await page.evaluate(() => [localStorage.length, sessionStorage.length])).toEqual([0, 0]);
});
