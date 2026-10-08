import { test, expect } from './fixtures.js';

test('drawer selection closes on constrained screens and stays open in wide landscape', async ({
  page,
}) => {
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  for (const viewport of [
    { width: 1280, height: 844 },
    { width: 390, height: 844 },
    { width: 844, height: 390 },
    { width: 1024, height: 1366 },
  ]) {
    const { width, height } = viewport;
    const staysOpen = width >= 980 && width > height;
    await page.setViewportSize(viewport);
    await page.goto('/#first-calculation');
    await page.getByRole('button', { name: 'Open course navigation', exact: true }).click();
    const drawer = page.locator('.sidebar');
    await expect(drawer).toBeVisible();
    await expect(drawer.locator('.sidebar-section-label')).toHaveText('Learn');
    await expect(
      drawer.locator('button, input, .sidebar-bottom, .module-list, #drawer-modes'),
    ).toHaveCount(0);
    const next = drawer.locator('#task-nav a').nth(1);
    const target = await next.getAttribute('href');
    await next.click();
    await expect(page).toHaveURL(new RegExp(`${target}$`));
    if (staysOpen) await expect(drawer).toBeVisible();
    else await expect(drawer).not.toBeVisible();
    await expect(drawer.locator('[aria-current="step"]')).toHaveAttribute('href', target);
    if (width === 390)
      await page.screenshot({
        path: 'tests/artifacts/drawer-selection-mobile.png',
        fullPage: false,
      });
    await page.screenshot({
      path: `tests/artifacts/drawer-only-headings-${width}.png`,
      fullPage: true,
    });
    await page.keyboard.press('Escape');
    await expect(drawer).not.toBeVisible();
    if (width === 390) {
      const handle = await page.locator('#sidebar-toggle').boundingBox();
      const brand = await page.locator('.brand').boundingBox();
      const heading = await page.locator('.lesson-header').boundingBox();
      expect(handle.x + handle.width).toBeLessThanOrEqual(brand.x);
      expect(handle.y + handle.height).toBeLessThanOrEqual(heading.y);
      await page.screenshot({ path: 'tests/artifacts/drawer-handle-mobile.png', fullPage: false });
    }
  }
  expect(errors).toEqual([]);
});

test('drawer close handle stays under the pointer during a deliberate press', async ({ page }) => {
  for (const reducedMotion of ['no-preference', 'reduce']) {
    await page.emulateMedia({ reducedMotion });
    for (const width of [1280, 390]) {
      await page.setViewportSize({ width, height: 844 });
      await page.goto('/#first-calculation');
      const toggle = page.locator('#sidebar-toggle');
      await toggle.click();
      await expect(page.locator('.sidebar')).toBeVisible();
      await expect
        .poll(async () => Math.round((await toggle.boundingBox()).x))
        .toBe(width === 390 ? 290 : 310);
      const before = await toggle.boundingBox();
      await page.mouse.move(before.x + before.width / 2, before.y + before.height / 2);
      await page.mouse.down();
      // A human press lasts long enough for a conflicting :active transform to move the target.
      await page.waitForTimeout(180);
      const held = await toggle.boundingBox();
      expect(Math.abs(held.x - before.x)).toBeLessThan(1);
      expect(Math.abs(held.y - before.y)).toBeLessThan(1);
      await page.mouse.up();
      await expect(toggle).toHaveAttribute('aria-expanded', 'false');
      await expect(page.locator('.sidebar')).not.toBeVisible();
      if (width === 390 && reducedMotion === 'no-preference')
        await page.screenshot({ path: 'tests/artifacts/drawer-close-fixed.png', fullPage: false });
    }
  }
});
