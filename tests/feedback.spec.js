import { test, expect } from './fixtures.js';

test('every code task and guided stage accepts alternative syntax and helpers, and explains an incomplete answer', async ({
  page,
}) => {
  await page.goto('/');
  const failures = await page.evaluate(async () => {
    const { tasks, guided, runtime } = window.workshop;
    const code = tasks.filter((t) => t.kind === 'code');
    const cases = [
      ...code,
      ...code.flatMap((t) =>
        (guided[t.id] || []).map((s, i) => ({ ...t, ...s, id: t.id + '-step-' + i })),
      ),
    ];
    const failures = [];
    for (const task of cases) {
      await runtime.resetTask(task);
      const alternative =
        '# My own working\nworking_note <- "practice"\n' + task.solution.replace(/ <- /g, ' = ');
      const good = await runtime.run(alternative, task, true);
      if (good.error || good.checks.some((c) => !c.passed))
        failures.push({
          id: task.id,
          reason: 'Alternative rejected',
          output: good.output,
          checks: good.checks.filter((c) => !c.passed),
        });
      await runtime.resetTask(task);
      const bad = await runtime.run('invisible(NULL)', task, true);
      const failed = bad.checks.filter((c) => !c.passed);
      if (!failed.length || !failed[0].feedback?.includes('Run'))
        failures.push({ id: task.id, reason: 'No actionable failure feedback', checks: failed });
      for (const image of [...good.images, ...bad.images]) image.close();
    }
    return failures;
  });
  expect(failures).toEqual([]);
});

test('specific mistakes explain missing names, naming differences, wrong types, wrong values, and fresh runs', async ({
  page,
}) => {
  await page.goto('/#assignment');
  const run = async (code) => {
    await page.evaluate((c) => window.workshop.setEditor(c), code);
    await page.getByRole('button', { name: 'Run', exact: true }).click();
    await page.waitForFunction(() => !window.workshop.busy, { timeout: 90000 });
  };
  await run('40');
  await expect(page.locator('#feedback')).toContainText('calculation is right');
  await expect(page.locator('#feedback')).toContainText('ticket_price <-');
  await run('Ticket_Price <- 40');
  await expect(page.locator('#feedback')).toContainText('You used Ticket_Price');
  await run('ticket_price <- "40"');
  await expect(page.locator('#feedback')).toContainText('text, but it needs numbers');
  await run('ticket_price <- 39');
  await expect(page.locator('#feedback')).toContainText('ticket_price is 39; expected 40');
  await run('ticket_price <- 40');
  await expect(page.locator('#feedback')).toContainText('Correct.');
  await run('invisible(NULL)');
  await expect(page.locator('#feedback')).not.toContainText('Correct.');
  await expect(page.locator('#feedback')).toContainText('ticket_price');
  await run('ticket_price <-');
  await expect(page.locator('#feedback')).toContainText('last line ends with an operator');
  await page.goto('/#syntax');
  await page.evaluate(() => window.workshop.execute(true));
  await expect(page.locator('#feedback')).toContainText('line 2');
  await expect(page.locator('#feedback')).toContainText('closing');
  await page.goto('/#matrix');
  await run('m <- 1:6');
  await expect(page.locator('#feedback')).toContainText('2 rows and 3 columns');
  await page.screenshot({ path: 'tests/artifacts/actionable-feedback.png', fullPage: true });
});

test('reordered named structures and factor levels are accepted; malformed data is rejected', async ({
  page,
}) => {
  await page.goto('/');
  const results = await page.evaluate(async () => {
    const { runtime, tasks } = window.workshop;
    const cases = [
      [
        'lists',
        'report <- list(sales=c(40,30,50),label="October",revenue=120)\nunits <- report[["sales"]]',
        true,
      ],
      [
        'dataframes',
        'students <- data.frame(Score=c(78,91,88),Name=c("Ada","Ben","Cem"),ID=c(1,2,3))\naverage <- mean(students[["Score"]])',
        true,
      ],
      [
        'factors',
        'labels <- c("IT","HR","IT","Sales")\ndepartment <- factor(labels,levels=c("Sales","IT","HR"))\ncategories <- levels(department)\ncounts <- table(department)',
        true,
      ],
      [
        'dataframes',
        'students <- data.frame(ID=c(9,8,7),Name=c("Ada","Ben","Cem"),Score=c(78,91,88))\naverage <- mean(students$Score)',
        false,
      ],
      [
        'lists',
        'report <- list(revenue=120,label="October",sales=c(1,2,3))\nunits <- c(40,30,50)',
        false,
      ],
      [
        'ordered-factor',
        'education <- factor(character(),levels=c("High School","Bachelor","Master","PhD"),ordered=TRUE)',
        false,
      ],
    ];
    const results = [];
    for (const [id, code, accepted] of cases) {
      const task = tasks.find((t) => t.id === id);
      await runtime.resetTask(task);
      const result = await runtime.run(code, task, true);
      results.push({ id, accepted, actual: !result.error && result.checks.every((c) => c.passed) });
      for (const image of result.images) image.close();
    }
    return results;
  });
  for (const r of results) expect(r.actual, JSON.stringify(r)).toBe(r.accepted);
});

test('every wrong multiple-choice answer explains the mistake; written answers are labelled self-review', async ({
  page,
}) => {
  await page.goto('/');
  const choices = await page.evaluate(() =>
    window.workshop.tasks
      .filter((t) => t.kind === 'choice')
      .map((t) => ({ id: t.id, correct: t.correct, count: t.options.length })),
  );
  for (const task of choices) {
    await page.goto('/#' + task.id);
    for (let i = 0; i < task.count; i++)
      if (i !== task.correct) {
        await page.locator(`input[name=answer][value="${i}"]`).check();
        await page.getByRole('button', { name: 'Check answer', exact: true }).click();
        await expect(page.locator('#feedback')).toContainText('Choose another answer');
        expect((await page.locator('#feedback p').innerText()).length).toBeGreaterThan(70);
      }
  }
  const written = await page.evaluate(() =>
    window.workshop.tasks.filter((t) => t.kind === 'written').map((t) => t.id),
  );
  for (const id of written) {
    await page.goto('/#' + id);
    await expect(page.locator('.manual-note')).toContainText('Self-review');
    await page.getByRole('button', { name: 'Compare answer' }).click();
    await expect(page.locator('#solution')).toBeVisible();
    await expect(page.locator('#feedback')).not.toContainText('Correct.');
  }
});
