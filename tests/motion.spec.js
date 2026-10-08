import { test, expect } from './fixtures.js';

test('small transitions preserve choice feedback, details and reduced-motion access', async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/#expression-state');
  await page.getByRole('radio', { name: '120, 130, 120', exact: true }).check();
  await page.getByRole('button', { name: 'Check answer', exact: true }).click();
  await expect(page.locator('#feedback')).toContainText('Correct.');
  await page.getByRole('button', { name: 'Show solution', exact: true }).click();
  await expect(page.locator('#solution')).toBeVisible();
  await page.screenshot({ path: 'tests/artifacts/motion-feedback-mobile.png', fullPage: false });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/#first-calculation');
  await page.getByRole('button', { name: 'Hint', exact: true }).click();
  await expect(page.locator('#hints')).not.toBeEmpty();
  const active = await page.evaluate(
    () => document.getAnimations().filter((animation) => animation.playState === 'running').length,
  );
  expect(active).toBe(0);
  await page.getByRole('button', { name: 'Show solution', exact: true }).click();
  await expect(page.locator('#solution')).toBeVisible();
  expect(await page.locator('#solution').evaluate((el) => getComputedStyle(el).animationName)).toBe(
    'none',
  );
});
