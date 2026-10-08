import { test, expect } from './fixtures.js';

test('student functions cannot replace checks, inspection or the next task reset', async ({
  page,
}) => {
  await page.goto('/');
  await page.waitForFunction(() => window.workshop);
  const results = await page.evaluate(async () => {
    const { runtime, tasks } = window.workshop;
    const task = tasks.find((task) => task.id === 'first-calculation');
    await runtime.resetTask(task);
    const incorrect = await runtime.run(
      'isTRUE <- function(...) TRUE\nall.equal <- function(...) TRUE\nbase::assign("isTRUE", function(...) TRUE, envir=globalenv())\n999',
      task,
      true,
    );
    await runtime.resetTask(task);
    const correct = await runtime.run(
      'ls <- function(...) stop("student ls")\nget <- function(...) stop("student get")\nhead <- function(...) stop("student head")\nlocal <- function(...) stop("student local")\n2',
      task,
      true,
    );
    await runtime.resetTask(task);
    const recovered = await runtime.run('2', task, true);
    return {
      incorrect: incorrect.checks.map((check) => check.passed),
      correct: correct.checks.map((check) => check.passed),
      objects: correct.objects.map((object) => ({ name: object.name, class: object.class })),
      recovered: recovered.checks.map((check) => check.passed),
      recoveredObjects: recovered.objects,
    };
  });
  expect(results.incorrect).toEqual([false]);
  expect(results.correct).toEqual([true]);
  expect(results.objects).toEqual(
    expect.arrayContaining([
      { name: ['ls'], class: ['function'] },
      { name: ['get'], class: ['function'] },
    ]),
  );
  expect(results.recovered).toEqual([true]);
  expect(results.recoveredObjects).toEqual([]);
});

test('reset restores initial R options and removes student option names', async ({ page }) => {
  await page.goto('/');
  await page.waitForFunction(() => window.workshop);
  const results = await page.evaluate(async () => {
    const { runtime, tasks } = window.workshop;
    const task = tasks.find((task) => task.id === 'first-calculation');
    await runtime.resetTask(task);
    const initial = await runtime.run('1/3', task);
    await runtime.run('options(digits=2, workshop_student_option=TRUE)\n1/3', task);
    await runtime.resetTask(task);
    const restored = await runtime.run('1/3', task);
    const extra = await runtime.run('is.null(getOption("workshop_student_option"))', task);
    return {
      initial: initial.output,
      restored: restored.output,
      extra: extra.output,
    };
  });
  expect(results.restored).toEqual(results.initial);
  expect(results.extra.some((item) => item.text.includes('TRUE'))).toBe(true);
});

test('source and save.image defaults use the lesson workspace without exposing helpers', async ({
  page,
}) => {
  await page.goto('/');
  await page.waitForFunction(() => window.workshop);
  const result = await page.evaluate(async () => {
    const { runtime, tasks } = window.workshop;
    const task = tasks.find((task) => task.id === 'scripts');
    await runtime.resetTask(task);
    const result = await runtime.run(
      'source("ticket-cost.R")\nsave.image("workspace.RData")\nrm(list=ls())\nload("workspace.RData")\nbill',
      task,
      true,
    );
    return {
      error: result.error,
      passed: result.checks.map((check) => check.passed),
      names: result.objects.flatMap((object) => object.name),
      output: result.output,
    };
  });
  expect(result.error).toBe(false);
  expect(result.passed).toEqual([true]);
  expect(result.names).toEqual(['bill', 'price', 'quantity']);
  expect(result.output.some((item) => item.text.includes('140'))).toBe(true);
});
