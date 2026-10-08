import { chromium } from '@playwright/test';
import assert from 'node:assert/strict';
const launchOptions = process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE
  ? { executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE }
  : process.env.CI
    ? {}
    : { channel: 'chrome' };
// Optional authoritative DNS override for a newly connected domain. TLS stays enabled.
if (process.env.WORKSHOP_HOST_RESOLVER_RULES)
  launchOptions.args = ['--host-resolver-rules=' + process.env.WORKSHOP_HOST_RESOLVER_RULES];
const browser = await chromium.launch(launchOptions);
const page = await browser.newPage({
  viewport: { width: 1440, height: 1000 },
  acceptDownloads: true,
});
const errors = [];
page.on('pageerror', (e) => errors.push(e.message));
const origin = process.env.WORKSHOP_PREVIEW_URL || 'http://127.0.0.1:4173';
try {
  const notices = await page.request.get(origin + '/THIRD_PARTY_NOTICES.txt');
  assert(notices.ok(), 'Software licence notices must accompany the deployed build.');
  const licenceText = await notices.text();
  for (const expected of [
    'Copyright (c) 2026 Arda Çeki',
    '@codemirror/view@',
    '@msgpack/msgpack@',
    'Copyright (c) 2023 webR authors',
  ]) {
    assert(licenceText.includes(expected), `Missing software notice: ${expected}`);
  }
  await page.addLocatorHandler(page.locator('#materials-dialog[open]'), () =>
    page.locator('#materials-continue').click(),
  );
  await page.goto(origin + '/#ticket-calculation');
  assert.equal(
    await page.evaluate(() => typeof window.workshop),
    'undefined',
    'Development harness must not be present in production.',
  );
  await page.screenshot({ path: 'tests/artifacts/desktop-initial.png', fullPage: true });
  const edit = async (code) => {
    await page.getByRole('textbox', { name: 'R code editor' }).fill(code);
  };
  const wait = async (text) => {
    await page.locator('#feedback').filter({ hasText: text }).waitFor({ timeout: 90000 });
  };
  await edit('40 * 3');
  await page.getByRole('button', { name: 'Run', exact: true }).click();
  await wait('Correct.');
  await edit('40 * 3 + 10');
  await page.getByRole('button', { name: 'Run', exact: true }).click();
  await wait('One thing to fix:');
  await edit('print(missing_object)');
  await page.getByRole('button', { name: 'Run', exact: true }).click();
  await wait('Let’s fix the code.');
  assert.match(await page.locator('#output-panel').innerText(), /missing_object/);
  await edit('as.numeric("apple")');
  await page.getByRole('button', { name: 'Run', exact: true }).click();
  await page.locator('#output-panel').filter({ hasText: 'Warning:' }).waitFor({ timeout: 30000 });
  await edit('bill <- 35 * 4');

  await page.locator('.brand').click();
  await page.locator('[data-open-mode="learn"]').click();
  await page.getByRole('button', { name: 'Open course navigation' }).click();
  await page.locator('#task-nav a[href="#ticket-calculation"]').click();
  await page.getByRole('heading', { name: 'Try it yourself', exact: true }).waitFor();
  await page.keyboard.press('Escape');
  assert.equal(
    await page.getByRole('textbox', { name: 'R code editor' }).innerText(),
    'bill <- 35 * 4',
  );
  assert.equal(
    await page.locator('#download-code, #reset-code, #reference-open, #reference-dialog').count(),
    0,
  );
  await page.goto(origin + '/#dataframes');
  await page.getByRole('button', { name: 'Show solution', exact: true }).click();
  await page.getByRole('button', { name: 'Use in editor' }).click();
  await page.getByRole('button', { name: 'Run', exact: true }).click();
  await wait('Correct.');
  await page.getByRole('tab', { name: /Objects/ }).click();
  await page.locator('[data-expression="students[2, 3]"]').click();
  assert.match(
    await page.locator('.cell-readout').filter({ hasText: 'students[2, 3]' }).innerText(),
    /91/,
  );
  await page.getByRole('button', { name: 'Course map', exact: true }).click();
  await page.getByRole('dialog', { name: 'Course map' }).waitFor();
  assert.match(await page.locator('#info-body').innerText(), /Later in the course/);
  await page.getByRole('button', { name: 'Close dialog' }).click();
  for (const width of [320, 390, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    assert(
      await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth),
      `Overflow at ${width}px`,
    );
  }
  await page.goto(origin + '/#paper-matrix');
  assert.equal(await page.getByRole('button', { name: 'Run', exact: true }).count(), 0);
  await page.getByLabel('6', { exact: true }).check();
  await page.getByRole('button', { name: 'Check answer', exact: true }).click();
  await wait('Correct.');
  assert.deepEqual(errors, []);
  console.log(
    'Production passed: real R, positive and negative checking, missing-object errors, warnings, menu-return draft preservation, data-frame visualisation, course map, 320/390/768/1440px layout, paper practice, no development harness or page errors.',
  );
} finally {
  await browser.close();
}
