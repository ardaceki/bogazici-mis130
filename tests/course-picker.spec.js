import { dismissArrivalNotice } from './fixtures.js';
import { test, expect } from './fixtures.js';

test('course weeks toggles closed on repeated mouse and touch presses', async ({ browser }) => {
  for (const hasTouch of [false, true]) {
    const context = await browser.newContext({
      hasTouch,
      viewport: { width: hasTouch ? 390 : 1440, height: 900 },
    });
    const page = await context.newPage();
    await dismissArrivalNotice(page);
    await page.goto('/');
    const trigger = page.locator('#course-unit');
    const press = () => (hasTouch ? trigger.tap() : trigger.click());
    await press();
    await expect(trigger).toHaveAttribute('aria-expanded', 'true');
    await expect(page.getByRole('listbox')).toBeVisible();
    await press();
    await expect(trigger).toHaveAttribute('aria-expanded', 'false');
    await expect(page.getByRole('listbox')).not.toBeVisible();
    await expect(trigger).toBeFocused();
    expect(await trigger.evaluate((el) => getComputedStyle(el).outlineStyle)).toBe('none');
    await trigger.press('ArrowDown');
    await page.getByRole('option', { name: /First steps/ }).press('Escape');
    await expect(trigger).toBeFocused();
    expect(await trigger.evaluate((el) => getComputedStyle(el).outlineStyle)).toBe('solid');
    await press();
    await press();
    await press();
    await expect(trigger).toHaveAttribute('aria-expanded', 'true');
    await page.getByRole('option', { name: /Syntax/ }).press('Escape');
    await expect(page.getByRole('listbox')).not.toBeVisible();
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await press();
    await press();
    await expect(page.getByRole('listbox')).not.toBeVisible();
    await context.close();
  }
});
