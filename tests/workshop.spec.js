import { test, expect } from './fixtures.js';

test('all published coding solutions run and satisfy the actual answer checks', async ({
  page,
}) => {
  await page.goto('/');
  await page.waitForFunction(() => window.workshop);
  const outcomes = await page.evaluate(async () => {
    const results = [];
    const { runtime, tasks, guided } = window.workshop;
    const codingTasks = tasks.filter((t) => t.kind === 'code');
    const allCases = [
      ...codingTasks,
      ...codingTasks.flatMap((t) =>
        (guided[t.id] || []).map((stage, i) => ({ ...t, ...stage, id: t.id + '-step-' + i })),
      ),
    ];
    for (const task of allCases) {
      try {
        await runtime.resetTask(task);
        const result = await runtime.run(task.solution, task, true);
        results.push({
          id: task.id,
          error: result.error,
          output: result.output,
          failed: result.checks.filter((x) => !x.passed).map((x) => x.message),
        });
        await runtime.resetTask(task);
        const blank = await runtime.run('invisible(NULL)', task, true);
        if (blank.checks.every((c) => c.passed))
          results.push({ id: task.id, error: 'An empty solution incorrectly passed.' });
        for (const image of result.images) image.close();
      } catch (e) {
        results.push({ id: task.id, error: e.message });
      }
    }
    return results;
  });
  console.log(`Checked ${outcomes.length} coding solutions.`);
  expect(outcomes.filter((x) => x.error || x.failed?.length)).toEqual([]);
});

test('real editor, alternative answers, errors, clean navigation, objects, and no saved state', async ({
  page,
}) => {
  await page.goto('/#assignment');
  await page.waitForFunction(() => window.workshop);
  await page.evaluate(() =>
    window.workshop.setEditor(
      'ticket_price <- 40\nticket_count <- 3\ntotal_cost <- sum(rep(ticket_price, ticket_count))\ntotal_cost',
    ),
  );
  await page.getByRole('button', { name: 'Run', exact: true }).click();
  await expect(page.locator('#feedback')).toContainText('Correct.', { timeout: 90000 });
  await expect(page.locator('#output-panel')).toContainText('120');
  await page.getByRole('tab', { name: /Objects/ }).click();
  await expect(page.locator('#objects-panel')).toContainText('total_cost');
  await expect(page.locator('#object-count')).toHaveText('3');
  await page.evaluate(() => {
    document.activeElement?.blur();
    window.scrollTo(0, 0);
  });
  await page.screenshot({ path: 'tests/artifacts/desktop-objects.png', fullPage: true });
  await page.evaluate(() => window.workshop.navigate('first-calculation'));
  await expect(page.locator('#task-heading')).toHaveText('Start with 1 + 1');
  await page.evaluate(() => window.workshop.setEditor('ls()'));
  await page.getByRole('button', { name: 'Run', exact: true }).click();
  await expect(page.locator('#output-panel')).toContainText('character(0)', { timeout: 30000 });
  await page.evaluate(() => window.workshop.setEditor('1 +'));
  await page.getByRole('button', { name: 'Run', exact: true }).click();
  await expect(page.locator('#feedback')).toContainText('Let’s fix the code.');
  await expect(page.locator('#output-panel')).toContainText('Error:');
  await page.evaluate(() => window.workshop.setEditor('2'));
  await page.getByRole('button', { name: 'Run', exact: true }).click();
  await expect(page.locator('#feedback')).toContainText('Correct.');
  const storage = await page.evaluate(() => ({
    local: localStorage.length,
    session: sessionStorage.length,
    cookies: document.cookie,
  }));
  expect(storage).toEqual({ local: 0, session: 0, cookies: '' });
  await page.reload();
  await expect(page.locator('.cm-content')).toContainText('1 + 1');
  await expect(page.locator('#object-count')).toHaveText('0');
});

test('choices, written self-review, free navigation, source links, and mobile layout', async ({
  page,
}) => {
  await page.goto('/#expression-state');
  await page.getByLabel('120, 130, 120', { exact: true }).check();
  await page.getByRole('button', { name: 'Check answer', exact: true }).click();
  await expect(page.locator('#feedback')).toContainText('Correct.');
  await page.goto('/#ps2-panes');
  await page
    .getByLabel('Your answer', { exact: true })
    .fill('Source Editor, Console, Environment, Help.');
  await page.getByRole('button', { name: 'Compare answer' }).click();
  await expect(page.locator('#solution')).toContainText('Source Editor');
  await page.getByRole('button', { name: 'Source ↗', exact: true }).click();
  await expect(page.getByRole('dialog', { name: 'Source material' })).toBeVisible();
  await page.getByRole('button', { name: 'Close source material' }).click();
  await page.goto('/#matrix-names');
  await page.evaluate(() => window.workshop.setEditor(window.workshop.current.solution));
  await page.getByRole('button', { name: 'Run', exact: true }).click();
  await expect(page.locator('#feedback')).toContainText('Correct.', { timeout: 90000 });
  await page.getByRole('tab', { name: /Objects/ }).click();
  await page.locator('[data-expression="sales[2, 2]"]').click();
  await expect(page.locator('.cell-readout').filter({ hasText: 'sales[2, 2]' })).toContainText(
    '110',
  );
  await page.evaluate(() => {
    document.activeElement?.blur();
    window.scrollTo(0, 0);
  });
  await page.screenshot({ path: 'tests/artifacts/desktop-matrix.png', fullPage: true });
  await page.setViewportSize({ width: 390, height: 844 });
  await expect(page.locator('.menu-toggle')).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(
    true,
  );
  await page.screenshot({ path: 'tests/artifacts/mobile-matrix.png', fullPage: true });
  await page.goto('/#lab3-population');
  await page.getByRole('button', { name: 'Show solution', exact: true }).click();
  await expect(page.locator('#solution')).toContainText('moveA');
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(
    true,
  );
});

test('stopping an infinite loop recovers the interpreter', async ({ page }) => {
  await page.goto('/#first-calculation');
  await page.evaluate(() => window.workshop.setEditor('1 + 1'));
  await page.getByRole('button', { name: 'Run', exact: true }).click();
  await expect(page.locator('#output-panel')).toContainText('[1] 2', { timeout: 90000 });
  await page.evaluate(() => window.workshop.setEditor('while (TRUE) {}'));
  await page.getByRole('button', { name: 'Run', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Stop', exact: true })).toBeVisible();
  await expect(page.locator('#runtime-status')).toHaveText('Running…', { timeout: 90000 });
  await page.waitForTimeout(300); // Let the worker enter the loop before terminating it.
  await page.getByRole('button', { name: 'Stop', exact: true }).click();
  await expect(page.locator('#feedback')).toContainText('Stopped.');
  await page.evaluate(() => window.workshop.setEditor('1 + 1'));
  await page.getByRole('button', { name: 'Run', exact: true }).click();
  await expect(page.locator('#feedback')).toContainText('Correct.', { timeout: 90000 });
});
