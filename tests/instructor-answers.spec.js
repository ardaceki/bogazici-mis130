import { test, expect } from './fixtures.js';

// These indices refer to the original instructor HTML's R chunks, not our
// rewritten task solutions. Include initialization and omit the separately shown
// intentional error in PS 2 Q4 (it is tested below).
const sourceCases = [
  ['lab2-three', 'lab2', [0]],
  ['lab2-operators', 'lab2', [1]],
  ['lab2-compound', 'lab2', [2]],
  ['lab2-seconds', 'lab2', [3]],
  ['lab2-future', 'lab2', [4]],
  ['lab2-pi', 'lab2', [5]],
  ['ps2-tickets', 'ps2', [1]],
  ['ps2-types', 'ps2', [3]],
  ['ps2-remove', 'ps2', [5, 7]],
  ['ps2-script', 'ps2', [11]],
  ['ps3-debug', 'ps3', [1]],
  ['ps3-operators', 'ps3', [2, 3]],
  ['ps3-length', 'ps3', [4]],
  ['ps3-matrix', 'ps3', [5]],
  ['lab3-population', 'lab3', [0, 1, 2, 3]],
  ['lab3-boxes', 'lab3', [4, 5, 6]],
  ['lab3-grade', 'lab3', [7, 8, 9]],
  ['lab3-sales', 'lab3', [10, 11, 12]],
  ['lab3-departments', 'lab3', [13, 14, 15]],
];

test('all 19 instructor coding answers pass directly from the four supplied HTML documents', async ({
  page,
}) => {
  await page.goto('/');
  const results = await page.evaluate(async (cases) => {
    const { runtime, tasks } = window.workshop;
    const documents = {};
    for (const key of ['lab2', 'ps2', 'lab3', 'ps3']) {
      const response = await fetch(`/sources/${key}-answers.html`);
      if (!response.ok) throw new Error(`Missing ${key} instructor answers`);
      const doc = new DOMParser().parseFromString(await response.text(), 'text/html');
      documents[key] = [...doc.querySelectorAll('pre.r code')].map((node) => node.textContent);
    }
    const results = [];
    for (const [id, source, chunks] of cases) {
      const task = tasks.find((task) => task.id === id);
      const code = chunks.map((index) => documents[source][index]).join('\n');
      if (!code.trim() || chunks.some((index) => !documents[source][index]))
        throw new Error(`Missing R chunk for ${id}`);
      await runtime.resetTask(task);
      const result = await runtime.run(code, task, true);
      results.push({
        id,
        error: result.error,
        output: result.output,
        failed: result.checks.filter((check) => !check.passed).map((check) => check.message),
      });
      for (const image of result.images) image.close();
    }
    return results;
  }, sourceCases);
  expect(results).toHaveLength(19);
  expect(results.filter((result) => result.error || result.failed.length)).toEqual([]);
});

const alternatives = [
  ['lab2-three', 'nums <- c(13L,27L,14L)\nc(sum(nums),mean(nums),prod(nums))'],
  ['lab2-operators', 'u <- 13L; v <- 5L\nprint(u-v)\nprint(u^v)\nprint(u%%v)'],
  [
    'lab2-compound',
    'i=12; n=5; A=1000\nbig=round(A*1.12^n,2)\nA=500\nsmall=round(A*1.12^n,2)\nbig\nsmall',
  ],
  ['lab2-seconds', '(5*365+2*30+4)*86400+3*3600+2*60'],
  ['lab2-future', 'money=1000\nfuture=money*(1+8/100)^5\nprint(future)'],
  ['lab2-pi', 'a=pi^2; b=sqrt(pi); c=floor(pi); d=ceiling(pi)\nlist(a,b,c,d,a*b*c*d)'],
  [
    'ps2-tickets',
    'ticket_price=40; ticket_count=3\ntotal_cost=sum(rep(ticket_price,ticket_count))\namount_due=10+total_cost',
  ],
  [
    'ps2-types',
    'room_label="24"; seat_count=24\nclass(seat_count); class(room_label)\nseat_count+1\nseat_count="full"\nclass(seat_count)\nseat_count=24L',
  ],
  [
    'ps2-remove',
    'ps01_score=8; ps01_note="practice"; helper=99\nobjects()\nrm(list="ps01_note")\ntry(print(ps01_note))\nps01_note="practice"',
  ],
  ['ps2-script', 'folder=getwd()\nsource(file.path(folder,"ticket-cost.R"))'],
  ['ps3-debug', 'x=10L; y="apple"\nz=sum(x,5L)\nprint(z)'],
  [
    'ps3-operators',
    'a=17L; b=5L; p=TRUE; q=FALSE\nlist(or_case=(a<b)|q, and_case=(a>b)&p, gt=a>b, combined=a%%b+a%/%b, integer_division=a%/%b, modulo=a%%b)',
  ],
  ['ps3-length', 'x=c(4L,8L,12L)\nx=c(x,rep(NA_integer_,3))\nx=head(x,2)\nx'],
  [
    'ps3-matrix',
    'm=rbind(R1=1:4,R2=5:8,R3=9:12)\ncolnames(m)=paste0("C",1:4)\nlist(col_sums=apply(m,2,sum),r2c3=m[2,3],row_sums=apply(m,1,sum))',
  ],
  [
    'lab3-population',
    'cityA=10000; cityB=20000\nfor(i in 1:5){ old=c(cityA,cityB); cityB=old[2]*.98+old[1]*.01; cityA=sum(old)-cityB }',
  ],
  ['lab3-boxes', '983 %/% 24\n983 %% 24'],
  ['lab3-grade', 'sum(c(78,91,mean(c(86,92,88,90)))*c(.35,.45,.20))'],
  [
    'lab3-sales',
    'sales=rbind(A=c(M1=120,M2=95,M3=140),B=c(M1=85,M2=110,M3=130))\nlist(apply(sales,1,sum),sum(sales),which.max(apply(sales,2,sum)))',
  ],
  [
    'lab3-departments',
    'scores=rbind(IT=c(88,92,79,85),HR=c(75,81,69,74),Sales=c(91,95,89,93))\ncolnames(scores)=paste0("Q",1:4)\navgs=apply(scores,1,mean)\navgs\napply(scores,2,mean)\nrownames(scores)[which.max(avgs)]\nfactor(rownames(scores),levels=c("Sales","IT","HR"))',
  ],
];

test('each instructor coding question accepts a genuinely different correct calculation or answer format', async ({
  page,
}) => {
  await page.goto('/');
  const failures = await page.evaluate(async (cases) => {
    const { runtime, tasks } = window.workshop;
    const failures = [];
    for (const [id, code] of cases) {
      const task = tasks.find((task) => task.id === id);
      await runtime.resetTask(task);
      const result = await runtime.run(code, task, true);
      if (result.error || result.checks.some((check) => !check.passed))
        failures.push({
          id,
          output: result.output,
          failed: result.checks.filter((check) => !check.passed),
        });
      for (const image of result.images) image.close();
    }
    return failures;
  }, alternatives);
  expect(alternatives).toHaveLength(sourceCases.length);
  expect(failures).toEqual([]);
});

const mistakes = [
  ['lab2-three', '54\n4914\n18'],
  ['lab2-three', 'c(54,18,4914.00000001)'],
  ['lab2-three', 'list("54",18,4914)'],
  ['lab2-three', 'matrix(c(54,18,4914),nrow=1)'],
  ['lab2-three', 'total=0\nc(54,18,4914)'],
  ['lab2-three', 'cat("54\\n18\\n4914\\n")'],
  ['lab2-three', '.workshop_outputs=list(54,18,4914)\ninvisible(NULL)'],
  ['lab2-operators', 'c(8,371293,2)'],
  ['lab2-compound', 'i=12; n=5; A=1000\n1762.34\nA=500\n1762.34'],
  ['lab2-compound', 'i=12; n=5; A=1000\n1000*1.12^5\nA=500\n500*1.12^5'],
  ['lab2-seconds', '163220520.00000003'],
  ['lab2-future', 'FV=1469.328'],
  [
    'lab2-pi',
    'sq=pi^2; sq_root=sqrt(sq); pi_floor=floor(sq_root); pi_ceiling=ceiling(pi_floor)\nsq*sq_root*pi_floor*pi_ceiling',
  ],
  ['lab2-pi', 'pi^2*sqrt(pi)*3*4'],
  ['ps2-types', 'seat_count=24; room_label="24"'],
  ['ps2-remove', 'ps01_note="practice"; ps01_score=8'],
  [
    'ps2-remove',
    'ps01_note="practice"; ps01_score=8\nrm(list=ls())\nps01_note="practice"; ps01_score=8',
  ],
  [
    'ps2-remove',
    '.workshop_states=list(list(ps01_note=list(exists=FALSE)))\nps01_note="practice"; ps01_score=8',
  ],
  ['ps2-script', 'bill=140'],
  ['ps3-debug', 'x=11; y="apple"; z=15'],
  ['ps3-operators', 'c(2,3,5,TRUE,TRUE,FALSE)'],
  [
    'ps3-operators',
    'list(modulo=2,integer_division=3,combined=5,gt=TRUE,and_case=TRUE,or_case=TRUE)',
  ],
  ['ps3-length', 'x=c(4,8)\nextended=c(4,8,12,NA,NA,NA)'],
  ['ps3-length', 'x=c(4,8,12,NA,NA,NA)\nx=c(4,8,12)\nx=c(4,8)'],
  [
    'ps3-matrix',
    'm=matrix(0,3,4); rownames(m)=paste0("R",1:3);colnames(m)=paste0("C",1:4)\nlist(r2c3=7,row_sums=c(10,26,42),col_sums=c(15,18,21,24))',
  ],
  [
    'lab3-population',
    'cityA=10000; cityB=20000\nfor(i in 1:5){ cityA=cityA*.99+cityB*.02; cityB=cityB*.98+cityA*.01 }',
  ],
  ['lab3-population', 'cityA=11412.66; cityB=18587.34'],
  ['lab3-boxes', 'full_boxes=41; leftover=23'],
  ['lab3-grade', 'project=89; overall=mean(c(78,91,89))'],
  [
    'lab3-sales',
    'sales=matrix(c(120,95,140,85,110,130),2,byrow=TRUE)\ntotal_units_per_product=c(355,325); grand_total=680;month_totals=c(205,205,270);best_month=3',
  ],
  [
    'lab3-departments',
    'scores=matrix(c(88,92,79,85,75,81,69,74,91,95,89,93),3,byrow=TRUE);rownames(scores)=c("IT","HR","Sales");colnames(scores)=paste0("Q",1:4)\ndept_avg=c(86,74.75,92);quarter_avg=c(254/3,268/3,79,84);best_dept="Sales";dept_factor=factor(c("IT","HR","Sales"),levels=c("IT","HR","Sales","Other"))',
  ],
];

test('incorrect values, types, shapes, precision, skipped transitions and forged evidence fail with actionable feedback', async ({
  page,
}) => {
  await page.goto('/');
  const failures = await page.evaluate(async (cases) => {
    const { runtime, tasks } = window.workshop;
    const failures = [];
    for (const [id, code] of cases) {
      const task = tasks.find((task) => task.id === id);
      await runtime.resetTask(task);
      const result = await runtime.run(code, task, true);
      const failed = result.checks.filter((check) => !check.passed);
      if (result.error || !failed.length || !failed[0].feedback?.includes('Run'))
        failures.push({ id, code, output: result.output, checks: result.checks });
      for (const image of result.images) image.close();
    }
    return failures;
  }, mistakes);
  expect(failures).toEqual([]);
});

test('expected removal error stops a bare script, try observes it and continues; later runs start fresh', async ({
  page,
}) => {
  await page.goto('/#ps2-remove');
  const result = await page.evaluate(async () => {
    const { runtime, current } = window.workshop;
    const before = 'ps01_note="practice"; ps01_score=8\nrm(ps01_note)\n';
    const after = '\nps01_note="practice"';
    await runtime.resetTask(current);
    const stopped = await runtime.run(before + 'print(ps01_note)' + after, current, true);
    await runtime.resetTask(current);
    const observed = await runtime.run(before + 'try(print(ps01_note))' + after, current, true);
    await runtime.resetTask(current);
    const incomplete = await runtime.run('ps01_note="practice"; ps01_score=8', current, true);
    return {
      stopped: stopped.error,
      observed: observed.error || observed.checks.some((check) => !check.passed),
      expectedError: observed.output.some((entry) => entry.text.includes('not found')),
      freshRejected: incomplete.checks.some((check) => !check.passed),
    };
  });
  expect(result).toEqual({
    stopped: true,
    observed: false,
    expectedError: true,
    freshRejected: true,
  });
});

test('grouped statements preserve R visibility while recording genuine intermediate states', async ({
  page,
}) => {
  await page.goto('/');
  const outcomes = await page.evaluate(async () => {
    const { runtime, tasks } = window.workshop;
    const cases = [
      ['ps3-length', '{ x=c(4,8,12); length(x)=6; length(x)=2; x }', true],
      ['ps2-types', '{ seat_count=24; room_label="24"; seat_count="full"; seat_count=24 }', true],
      [
        'ps2-remove',
        '{ ps01_note="practice"; ps01_score=8; rm(ps01_note); ps01_note="practice" }',
        true,
      ],
      ['lab2-three', '{ print(54); print(18); print(4914) }', true],
      ['lab2-three', '{ 54; 18; 4914 }', false],
    ];
    const outcomes = [];
    for (const [id, code, expected] of cases) {
      const task = tasks.find((task) => task.id === id);
      await runtime.resetTask(task);
      const result = await runtime.run(code, task, true);
      outcomes.push({
        id,
        expected,
        passed: !result.error && result.checks.every((check) => check.passed),
        output: result.output,
      });
      for (const image of result.images) image.close();
    }
    return outcomes;
  });
  for (const outcome of outcomes)
    expect(outcome.passed, JSON.stringify(outcome)).toBe(outcome.expected);
  expect(outcomes[0].output.map((entry) => entry.text).join('\n')).toContain('[1] 4 8');
  expect(outcomes[4].output.map((entry) => entry.text).join('\n')).not.toContain('[1] 54');
});

test('course feedback identifies partial success and the actual type/value error', async ({
  page,
}) => {
  await page.goto('/#lab2-three');
  await page.evaluate(() => window.workshop.setEditor('c(54,17,4914)'));
  await page.getByRole('button', { name: 'Run', exact: true }).click();
  await expect(page.locator('#feedback')).toContainText('Sum and Product are correct.', {
    timeout: 90000,
  });
  await expect(page.locator('#feedback')).toContainText('Mean is 17; expected 18');
  await page.evaluate(() => window.workshop.setEditor('list(54,"18",4914)'));
  await page.getByRole('button', { name: 'Run', exact: true }).click();
  await expect(page.locator('#feedback')).toContainText('text, but it needs numbers');
  await expect(page.locator('#feedback')).not.toContainText('has not been saved');
});

test('all 21 questions link their instructor section; feedback and written reviews state the actual check scope', async ({
  page,
}) => {
  await page.goto('/');
  const ids = await page.evaluate(() =>
    window.workshop.tasks.filter((task) => task.mode === 'practice').map((task) => task.id),
  );
  expect(ids).toHaveLength(21);
  for (const id of ids) {
    await page.goto('/#' + id);
    await page.getByRole('button', { name: 'Source ↗', exact: true }).click();
    await expect(page.locator('#source-body a').first()).toHaveText(/Instructor answers/);
    await expect(page.locator('#source-body a').first()).toHaveAttribute('href', /answers\.html#/);
    await page.getByRole('button', { name: 'Close source material' }).click();
  }
  for (const id of ['ps2-panes', 'ps2-help']) {
    await page.goto('/#' + id);
    await page.getByRole('button', { name: 'Compare answer' }).click();
    await expect(page.locator('#solution')).toContainText('Self-review');
    await expect(page.locator('#feedback')).not.toContainText('Correct.');
  }
  await page.goto('/#ps3-length');
  await page.getByRole('button', { name: 'Show solution', exact: true }).click();
  await expect(page.locator('#solution h3')).toHaveText('Instructor solution');
  await page.getByRole('button', { name: 'Use in editor' }).click();
  await page.getByRole('button', { name: 'Run', exact: true }).click();
  await expect(page.locator('#feedback')).toContainText('Code checks passed.', { timeout: 90000 });
  await expect(page.locator('#feedback')).toContainText('Self-review');
  await expect(page.locator('#output-panel')).toContainText('$x_final');
  const outputText = await page.locator('pre.output').textContent();
  expect(outputText.trimStart()).toMatch(/^\$x_extended\n\[1\]/);
  expect(outputText.split('\n').length).toBeLessThan(12);
  await page.setViewportSize({ width: 320, height: 850 });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.screenshot({ path: 'tests/artifacts/instructor-feedback-mobile.png', fullPage: true });
});
