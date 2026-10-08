import { test, expect } from './fixtures.js';

test('exercise navigation stays visible before and after scrolling', async ({ page }) => {
  for (const viewport of [
    { width: 1440, height: 900 },
    { width: 390, height: 844 },
  ]) {
    await page.setViewportSize(viewport);
    await page.goto('/#expression-state');
    await page.reload();
    const footer = page.getByRole('navigation', { name: 'Exercise navigation' });
    const assertOnscreen = async () => {
      const box = await footer.boundingBox();
      expect(box.y).toBeGreaterThanOrEqual(0);
      expect(box.y + box.height).toBeLessThanOrEqual(viewport.height);
      await expect(footer.getByRole('link', { name: '← Back', exact: true })).toBeInViewport();
      await expect(footer.locator('.next')).toBeInViewport();
    };
    await assertOnscreen();
    await page.getByRole('radio', { name: '120, 130, 120', exact: true }).check();
    await page.getByRole('button', { name: 'Check answer', exact: true }).click();
    await expect(footer.locator('.next')).toHaveText('Continue →');
    await assertOnscreen();
    await page.getByRole('button', { name: 'Show solution', exact: true }).click();
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await assertOnscreen();
    const solution = await page.locator('#solution').boundingBox();
    const navigation = await footer.boundingBox();
    expect(navigation.y + navigation.height).toBeLessThanOrEqual(solution.y);
    const siteFooter = page.locator('.site-footer');
    await expect(siteFooter).toBeVisible();
    const footerBox = await siteFooter.boundingBox();
    expect(footerBox.y).toBeGreaterThanOrEqual(solution.y + solution.height);
    await page.screenshot({
      path: `tests/artifacts/fixed-navigation-${viewport.width}.png`,
      fullPage: false,
    });
  }
});

test('wide landscape uses two columns and preserves the same work when resized', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/#expression-state');
  const code = await page.locator('.question-code').boundingBox();
  const options = await page.locator('.choices').boundingBox();
  expect(options.x).toBeGreaterThan(code.x + code.width);
  expect(Math.abs(options.y - code.y)).toBeLessThan(2);
  expect((await page.locator('main').boundingBox()).width).toBeGreaterThan(1000);
  await page.screenshot({ path: 'tests/artifacts/wide-choice.png', fullPage: true });
  await page.goto('/#assignment');
  await page.getByRole('button', { name: 'Run', exact: true }).click();
  await expect(page.locator('#feedback')).toContainText('Correct.', { timeout: 90000 });
  const input = await page.locator('.lesson-pane').boundingBox();
  const output = await page.locator('.results-pane').boundingBox();
  expect(output.x).toBeGreaterThan(input.x + input.width);
  await page.screenshot({ path: 'tests/artifacts/wide-code.png', fullPage: true });
  await page.setViewportSize({ width: 390, height: 844 });
  const mobileInput = await page.locator('#answer-area').boundingBox();
  const mobileOutput = await page.locator('.results-pane').boundingBox();
  expect(mobileOutput.y).toBeGreaterThanOrEqual(mobileInput.y + mobileInput.height);
  await expect(page.locator('#feedback')).toContainText('Correct.');
  await expect(page.getByRole('textbox', { name: 'R code editor' })).toContainText(
    'ticket_price <- 40',
  );
  await page.setViewportSize({ width: 1440, height: 900 });
  await expect(page.locator('.workspace')).toHaveClass(/has-results/);
  expect((await page.locator('.results-pane').boundingBox()).x).toBeGreaterThan(
    (await page.locator('.lesson-pane').boundingBox()).x,
  );
  await page.goto('/#paper-script');
  await page.getByLabel('Your answer', { exact: true }).fill('An R script stores commands.');
  await page.getByRole('button', { name: 'Compare answer' }).click();
  await expect(page.locator('#review-panel')).toBeVisible();
  expect((await page.locator('#review-panel').boundingBox()).x).toBeGreaterThan(
    (await page.locator('.lesson-pane').boundingBox()).x,
  );
  await page.setViewportSize({ width: 768, height: 1100 });
  await expect(page.locator('#review-panel')).not.toBeVisible();
  await expect(page.locator('#solution')).toBeVisible();
  await expect(page.getByLabel('Your answer', { exact: true })).toHaveValue(
    'An R script stores commands.',
  );
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.setViewportSize({ width: 1440, height: 2000 });
  await page.goto('/#expression-state');
  const portraitCode = await page.locator('.question-code').boundingBox();
  const portraitOptions = await page.locator('.choices').boundingBox();
  expect(portraitOptions.y).toBeGreaterThan(portraitCode.y + portraitCode.height);
});

test('home screen selects course weeks and opens a study mode directly', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('#start-screen')).toBeVisible();
  await expect(page.locator('#unit-title')).toHaveText('First steps in R');
  await expect(page.locator('.workspace')).not.toBeVisible();
  await expect(page.locator('.study-path')).toHaveCount(3);
  await page.screenshot({ path: 'tests/artifacts/start-screen-desktop.png', fullPage: false });
  await page.setViewportSize({ width: 390, height: 844 });
  await expect(page.locator('[data-open-mode="exam"]')).toBeInViewport();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.screenshot({ path: 'tests/artifacts/start-screen-mobile.png', fullPage: false });
  await page.locator('#course-unit').click();
  await expect(page.getByRole('listbox')).toBeVisible();
  await page.screenshot({ path: 'tests/artifacts/course-dropdown-mobile.png', fullPage: false });
  await page.locator('[data-course-unit="foundations"]').press('Enter');
  await expect(page.getByRole('listbox')).not.toBeVisible();
  await expect(page.locator('#course-unit')).toBeFocused();
  await page.locator('#course-unit').press('ArrowDown');
  await page.getByRole('option', { name: /Syntax/ }).press('Escape');
  await expect(page.locator('#course-unit')).toHaveAttribute('aria-expanded', 'false');
  await expect(page.locator('#unit-title')).toHaveText('Syntax & objects');
  await expect(page.locator('[data-open-mode="practice"]')).toHaveAttribute('href', /#ps3-/);
  await page.locator('[data-open-mode="practice"]').click();
  await expect(page.locator('.workspace')).toBeVisible();
  await expect(page.locator('#start-screen')).not.toBeVisible();
  await page.locator('#sidebar-toggle').click();
  await expect(page.locator('.sidebar')).toBeVisible();
  await page.locator('#sidebar-toggle').press('Escape');
  await expect(page.locator('.sidebar')).not.toBeVisible();
  await page.locator('.brand').click();
  await expect(page.locator('#course-unit')).toContainText('Weeks 2–3 · Syntax & objects');
  await expect(page.locator('#unit-title')).toHaveText('Syntax & objects');
});
