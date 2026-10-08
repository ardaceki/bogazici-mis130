import { test, expect } from './fixtures.js';

test('keyboard drawer navigation and guided steps preserve a useful focus position', async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/#first-calculation');
  const toggle = page.locator('#sidebar-toggle');
  await toggle.focus();
  await page.keyboard.press('Enter');
  await expect(page.locator('#task-nav [aria-current]')).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(page.locator('#task-nav a').nth(1)).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(toggle).toBeFocused();
  await expect(toggle).toHaveAttribute('aria-expanded', 'false');

  await page.goto('/#assignment');
  await page.locator('#next-step').focus();
  await page.keyboard.press('Enter');
  await expect(page.locator('#task-heading')).toBeFocused();
  await expect(page.locator('#task-position')).toHaveText('Step 2 of 3');
  await page.locator('#previous-step').focus();
  await page.keyboard.press('Enter');
  await expect(page.locator('#task-heading')).toBeFocused();
  await expect(page.locator('#task-position')).toHaveText('Step 1 of 3');
});

test('written drafts survive other tasks and home until a reload', async ({ page }) => {
  await page.goto('/#paper-script');
  const answer = page.getByRole('textbox', { name: 'Your answer', exact: true });
  const draft = 'Save the commands in a script, then source the file in a clean session.';
  await answer.fill(draft);
  await page.locator('.brand').click();
  await page.evaluate(() => {
    location.hash = 'paper-write';
  });
  await expect(page.locator('#task-heading')).toHaveText('Write code without running');
  await answer.fill('A second independent draft.');
  await page.evaluate(() => {
    location.hash = 'paper-script';
  });
  await expect(page.locator('#task-heading')).toHaveText('Script or workspace?');
  await expect(answer).toHaveValue(draft);
  expect(await page.evaluate(() => [localStorage.length, sessionStorage.length])).toEqual([0, 0]);
  await page.reload();
  await expect(answer).toHaveValue('');
});

test('editing code clears the previous success and explains how to leave the editor', async ({
  page,
}) => {
  await page.goto('/#first-calculation');
  const editor = page.getByRole('textbox', { name: 'R code editor' });
  await editor.fill('2');
  await page.getByRole('button', { name: 'Run', exact: true }).click();
  await expect(page.locator('#feedback')).toContainText('Correct.', { timeout: 90000 });
  await editor.fill('999');
  await expect(page.locator('#feedback')).toBeEmpty();
  await expect(page.locator('.task-footer .next')).toHaveText('Skip →');
  await expect(editor).toHaveAttribute('aria-describedby', 'editor-shortcuts');
  await expect(page.locator('#editor-shortcuts')).toContainText('Escape, then Tab');
  await editor.focus();
  await page.keyboard.press('Escape');
  await page.keyboard.press('Tab');
  await expect(page.getByRole('button', { name: 'Run', exact: true })).toBeFocused();
});

test('loading failure points to the visible Run control and can recover', async ({ page }) => {
  await page.route('https://webr.r-wasm.org/**', (route) => route.abort());
  await page.goto('/#first-calculation');
  await expect(page.locator('#runtime-status')).toHaveText('R could not load', { timeout: 30000 });
  await page.getByRole('button', { name: 'Run', exact: true }).click();
  await expect(page.locator('#feedback')).toContainText('click Run to try again');
  await expect(page.getByRole('button', { name: 'Run', exact: true })).toBeVisible();
  await page.unroute('https://webr.r-wasm.org/**');
  await page.getByRole('button', { name: 'Run', exact: true }).click();
  await expect(page.locator('#feedback')).toContainText('Correct.', { timeout: 90000 });
});

test('small informational text meets the normal-text contrast threshold', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  const screens = [
    ['/', '#unit-source, .path-count, .site-footer, .footer-links a'],
    ['/#first-calculation', '#module-title, #task-position, .previous, .manual-note, .site-footer'],
    ['/#paper-script', '#module-title, #task-position, .written-label, .manual-note, .site-footer'],
    ['/#paper-matrix', '#module-title, #task-position, .choices, .site-footer'],
    ['/privacy.html', '.privacy-back, .privacy-page header p, .privacy-date'],
  ];
  for (const [url, selector] of screens) {
    await page.goto(url);
    const ratios = await page.locator(selector).evaluateAll((elements) => {
      const channels = (color) => color.match(/[\d.]+/g).map(Number);
      const luminance = (rgb) =>
        rgb.slice(0, 3).reduce((total, channel, i) => {
          const value = channel / 255;
          return (
            total +
            (value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4) *
              [0.2126, 0.7152, 0.0722][i]
          );
        }, 0);
      return elements
        .filter((element) => element.getClientRects().length)
        .map((element) => {
          let ancestor = element;
          let background;
          while (ancestor) {
            const color = channels(getComputedStyle(ancestor).backgroundColor);
            if (color.length === 3 || color[3] === 1) {
              background = color;
              break;
            }
            ancestor = ancestor.parentElement;
          }
          const text = luminance(channels(getComputedStyle(element).color));
          const surface = luminance(background || [255, 255, 255]);
          return {
            label: element.id || element.className,
            ratio: (Math.max(text, surface) + 0.05) / (Math.min(text, surface) + 0.05),
          };
        });
    });
    expect(ratios.length).toBeGreaterThan(0);
    for (const { label, ratio } of ratios)
      expect(ratio, `${url}: ${label}`).toBeGreaterThanOrEqual(4.5);
  }
});
