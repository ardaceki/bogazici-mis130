import { test, expect } from './fixtures.js';

test('every question and guided stage starts without review notes, revealed hints, solutions or feedback', async ({
  page,
}) => {
  await page.goto('/');
  const tasks = await page.evaluate(() =>
    window.workshop.tasks.map(({ id, kind, manual }) => ({ id, kind, manual })),
  );
  expect(tasks).toHaveLength(73);
  for (const task of tasks) {
    await page.evaluate((id) => window.workshop.navigate(id), task.id);
    let hasNextStage;
    do {
      await expect(page.locator('#solution')).toHaveCount(0);
      await expect(page.locator('#hints')).toBeEmpty();
      await expect(page.locator('#feedback')).toBeEmpty();
      if (task.kind === 'code') {
        await expect(page.locator('#answer-area .manual-note')).toHaveCount(1);
        await expect(page.locator('#answer-area .manual-note')).toHaveAttribute(
          'id',
          'editor-shortcuts',
        );
      }
      if (task.manual) {
        const text = (await page.locator('body').innerText()).replace(/\s+/g, ' ');
        expect(text, `${task.id} reveals its review before an attempt`).not.toContain(
          task.manual.replace(/\s+/g, ' '),
        );
      }
      hasNextStage = (await page.locator('#next-step').count()) > 0;
      if (hasNextStage) await page.locator('#next-step').click();
    } while (hasNextStage);
  }
});

test('practice questions do not disclose computed answers, diagnoses or solution strategy in their initial view', async ({
  page,
}) => {
  await page.goto('/');
  const cases = [
    ['ps2-tickets', ['120, 130, 120', 'does not reassign', 'R ignores comments']],
    ['ps2-types', ['the result 25', 'new character class', 'numeric → text → numeric']],
    ['ps2-remove', ['missing-object error', 'not found', 'try(print', 'does not erase']],
    ['ps2-script', ['140', '.R records commands', '.RData stores objects']],
    ['lab2-compound', ['1762.34', '881.17', 'does not update previously saved']],
    ['lab2-pi', ['209.921']],
    ['ps3-debug', ['missing closing quote', 'line 2', 'unmatched quotation']],
    ['ps3-operators', ['TRUE, TRUE, FALSE', 'coerces', 'converts them to one type']],
    ['ps3-length', ['extension adds NA', 'truncation removes']],
    ['lab3-population', ['11412.66', '18587.34', 'cityA_next', 'both flows must use']],
    ['lab3-grade', ['86.05', 'mean()']],
  ];
  for (const [id, spoilers] of cases) {
    await page.evaluate((id) => window.workshop.navigate(id), id);
    const text = (await page.locator('body').innerText()).toLowerCase();
    for (const spoiler of spoilers)
      expect(text, `${id}: premature disclosure of ${spoiler}`).not.toContain(
        spoiler.toLowerCase(),
      );
  }
});

test('review answers appear only after explicit solution access or checking and clear when editing or changing questions', async ({
  page,
}) => {
  await page.goto('/#ps2-tickets');
  await expect(page.locator('body')).not.toContainText('120, 130, 120');
  await page.getByRole('button', { name: 'Show solution', exact: true }).click();
  await expect(page.locator('#solution')).toContainText('120, 130, 120');
  await page.getByRole('button', { name: 'Hide solution', exact: true }).click();
  await expect(page.locator('body')).not.toContainText('120, 130, 120');
  await page.evaluate(() => window.workshop.setEditor(window.workshop.current.solution));
  await page.getByRole('button', { name: 'Run', exact: true }).click();
  await expect(page.locator('#feedback')).toContainText('Code checks passed.', { timeout: 90000 });
  await expect(page.locator('#feedback')).toContainText('120, 130, 120');
  await page.evaluate(() => window.workshop.setEditor('ticket_price <- 40'));
  await expect(page.locator('#feedback')).toBeEmpty();
  await expect(page.locator('body')).not.toContainText('120, 130, 120');
  await page.evaluate(() => window.workshop.navigate('ps3-debug'));
  await expect(page.locator('body')).not.toContainText('unmatched quotation');
  await page.getByRole('button', { name: 'Show solution', exact: true }).click();
  await expect(page.locator('#solution')).toContainText('unmatched quotation');
  await page.evaluate(() => window.workshop.navigate('ps2-tickets'));
  await expect(page.locator('#feedback')).toBeEmpty();
  await expect(page.locator('#solution')).toHaveCount(0);
  await expect(page.locator('body')).not.toContainText('120, 130, 120');
  await page.setViewportSize({ width: 320, height: 850 });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.screenshot({
    path: 'tests/artifacts/no-premature-answers-mobile.png',
    fullPage: true,
    animations: 'disabled',
  });
});
