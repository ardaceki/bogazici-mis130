import { test, expect } from './fixtures.js';

async function runCases(page, cases) {
  await page.goto('/');
  return page.evaluate(async (cases) => {
    const { runtime, tasks } = window.workshop;
    const results = [];
    for (const [id, code, expected] of cases) {
      const task = tasks.find((task) => task.id === id);
      await runtime.resetTask(task);
      const result = await runtime.run(code, task, true);
      results.push({
        id,
        code,
        expected,
        actual: !result.error && result.checks.every((check) => check.passed),
        error: result.error,
        output: result.output,
        failed: result.checks
          .filter((check) => !check.passed)
          .map((check) => check.feedback || check.message),
      });
      for (const image of result.images) image.close();
    }
    return results;
  }, cases);
}
function assertCases(results) {
  for (const result of results) {
    expect(result.error, JSON.stringify(result)).toBe(false);
    expect(result.actual, JSON.stringify(result)).toBe(result.expected);
    if (!result.expected) expect(result.failed[0], JSON.stringify(result)).toContain('Run');
  }
}

test('all eight reported audit examples now produce the intended verdict', async ({ page }) => {
  assertCases(
    await runCases(page, [
      ['lab2-three', 'for(answer in c(54,18,4914)) print(answer)', true],
      ['lab2-three', 'local({ print(54); print(18); print(4914) })', true],
      ['ps3-length', 'x=c(4,8,12); for(n in c(6,2)) length(x)=n; x', true],
      ['ps2-script', 'cat(getwd(), "\\n"); source("ticket-cost.R")', true],
      ['lab2-three', 'list(sum=54, mean=18, prod=4914)', true],
      [
        'lab3-grade',
        'project=c(86,92,88,90); overall=.35*78+.45*91+.2*mean(project); overall',
        true,
      ],
      ['ps2-script', 'getwd(); bill=140', false],
      ['ps3-debug', 'x=10; y="apple"; z=15', false],
    ]),
  );
});

test('native loops, nested scopes, return, break, next, aliases and namespaced output preserve R behavior', async ({
  page,
}) => {
  assertCases(
    await runCases(page, [
      [
        'lab2-three',
        'render=function(){ for(a in c(54,18,4914)){ if(a<0) next; print(a) }; return(invisible(NULL)) }; render()',
        true,
      ],
      ['lab2-three', 'i=0; repeat { i=i+1; print(c(54,18,4914)[i]); if(i==3) break }', true],
      ['lab2-three', 'i=1; while(i<=3){ cat(c(54,18,4914)[i],"\\n"); i=i+1 }', true],
      ['lab2-three', 'base::local({ for(a in c(54,18,4914)) base::print(a) })', true],
      ['lab2-three', 'display=print; for(a in c(54,18,4914)) display(a)', true],
      ['lab2-three', 'for(a in c(54,18,4914)) do.call(base::print,list(a))', true],
      [
        'lab2-three',
        'quoted=base::quote(base::print(54)); stopifnot(identical(quoted,quote(base::print(54)))); local({ print(54); print(18); print(4914) })',
        true,
      ],
      [
        'ps3-length',
        'x=c(4,8,12); resize=function(n){ length(x)<<-n }; for(n in c(6,2)) resize(n); x',
        true,
      ],
      [
        'ps3-length',
        'x=c(4,8,12); i=0; repeat {i=i+1; length(x)=c(6,2)[i]; if(i==2) break}; x',
        true,
      ],
      ['lab2-three', 'for(a in c(54,18,4913)) print(a)', false],
      ['lab2-three', 'local({print(54);print("18");print(4914)})', false],
      ['lab2-three', 'for(a in c("54","18","4914")) cat(a,"\\n")', false],
      ['ps3-length', 'x=c(4,8,12); for(n in c(5,2)) length(x)=n; x', false],
    ]),
  );
});

test('positional named lists allow arbitrary labels, while complete documented keys allow reordering', async ({
  page,
}) => {
  const results = await runCases(page, [
    ['lab2-three', 'list(sum=54,mean=18,prod=4914)', true],
    ['lab2-three', 'list(product=54,working=18,answer=4914)', true],
    ['lab2-three', 'list(product=4914,average=18,total=54,extra="note")', true],
    ['ps3-operators', 'list(a=2,b=3,c=5,d=TRUE,e=TRUE,f=FALSE)', true],
    ['lab2-three', 'list(sum=54,mean=17,prod=4914)', false],
    ['lab2-three', 'list(sum=54,mean="18",prod=4914)', false],
    ['lab2-three', 'list(sum=54,mean=18,prod=4914,extra=0)', false],
  ]);
  assertCases(results);
  expect(results[4].failed[0]).toContain('Mean is 17; expected 18');
  expect(results[5].failed[0]).toContain('text, but it needs numbers');
  expect(results[6].failed[0]).toContain('3 entries');
});

test('direct base print methods are observed in loops, local scopes, aliases and do.call without weakening checks', async ({
  page,
}) => {
  assertCases(
    await runCases(page, [
      ['lab2-three', 'for(a in c(54,18,4914)) base::print.default(a)', true],
      ['lab2-three', 'local({ for(a in c(54,18,4914)) print.default(a) })', true],
      ['lab2-three', 'p=base::print.default; for(a in c(54,18,4914)) p(a)', true],
      ['lab2-three', 'local({ p=print.default; for(a in c(54,18,4914)) p(a) })', true],
      ['lab2-three', 'p=get("print.default",envir=baseenv()); for(a in c(54,18,4914)) p(a)', true],
      [
        'lab2-three',
        'p=utils::getS3method("print","default",envir=baseenv()); for(a in c(54,18,4914)) p(a)',
        true,
      ],
      [
        'lab2-three',
        'for(a in c(54,18,4914)) do.call(base::print.default,list(x=a,quote=FALSE,digits=7))',
        true,
      ],
      ['lab2-three', 'for(a in c(54,18,4914)) base:::print.default(a)', true],
      ['lab2-three', 'for(a in c(54,17,4914)) base::print.default(a)', false],
      ['lab2-three', 'for(a in c("54","18","4914")) base::print.default(a)', false],
      [
        'lab2-three',
        'sink("hidden.txt"); for(a in c(54,18,4914)) base::print.default(a); sink()',
        false,
      ],
      ['ps3-debug', 'x=10; y="apple"; z=x+5; base::print.default(z)', true],
      ['ps3-debug', 'x=10; y="apple"; z=15; base::print.default("15")', false],
    ]),
  );
});

test('method hooks preserve native output, S3 default-method behavior, arguments and invisible return values', async ({
  page,
}) => {
  await page.goto('/');
  const results = await page.evaluate(async () => {
    const { runtime, tasks } = window.workshop;
    const base = tasks.find((task) => task.id === 'lab2-three');
    const code =
      'assign("print.demo",function(x,...) cat("custom\\n"),envir=globalenv())\nx=structure(54,class="demo")\nr=withVisible(base::print.default(x,quote=FALSE,digits=7))\nstopifnot(!r$visible,identical(r$value,x))\nprint.default(matrix(1:4,2),quote=FALSE)\nprint.factor(factor(c("A","B")))\nbase::print(list(1,2))';
    const results = [];
    for (const captureAnswers of [false, true]) {
      const task = { ...base, captureAnswers };
      await runtime.resetTask(task);
      const result = await runtime.run(code, task, false);
      results.push({ captureAnswers, error: result.error, output: result.output });
      for (const image of result.images) image.close();
    }
    return results;
  });
  expect(results.map((result) => result.error)).toEqual([false, false]);
  expect(results[1].output).toEqual(results[0].output);
  expect(results[1].output.map((entry) => entry.text).join('\n')).not.toContain('custom');
});

test('the weighted-grade answer is independent of optional project helper names and shapes', async ({
  page,
}) => {
  assertCases(
    await runCases(page, [
      [
        'lab3-grade',
        'project=c(86,92,88,90); overall=.35*78+.45*91+.2*mean(project); overall',
        true,
      ],
      [
        'lab3-grade',
        'project=list(items=c(86,92,88,90)); overall=.35*78+.45*91+.2*mean(project$items)',
        true,
      ],
      ['lab3-grade', 'project=c(86,92,88,90); overall=.35*78+.45*91+.2*sum(project)', false],
      [
        'lab3-sales',
        'sales=rbind(A=c(M1=120,M2=95,M3=140),B=c(M1=85,M2=110,M3=130)); month_totals=matrix(colSums(sales),nrow=1); total_units_per_product=rowSums(sales); grand_total=sum(sales); best_month=which.max(month_totals)',
        true,
      ],
    ]),
  );
});

test('script execution and numeric displays require real evidence, with clear directory feedback and fresh runs', async ({
  page,
}) => {
  const results = await runCases(page, [
    ['ps2-script', 'cat(getwd(),"\\n"); source("ticket-cost.R")', true],
    [
      'ps2-script',
      'print(getwd()); run_file=source; run_file(file.path(getwd(),"ticket-cost.R"))',
      true,
    ],
    ['ps2-script', 'getwd(); base::source("ticket-cost.R",local=TRUE)', true],
    [
      'ps2-script',
      'getwd(); lines=readLines("ticket-cost.R"); writeLines(c("# note",lines),"ticket-cost.R"); source("ticket-cost.R")',
      true,
    ],
    ['ps3-debug', 'x=10; y="apple"; z=x+5; local({cat(z,"\\n")})', true],
    ['ps3-debug', 'x=10; y="apple"; z=x+5; for(i in 1:1) base::print(z)', true],
    ['ps2-script', 'getwd(); bill=140; print(bill)', false],
    [
      'ps2-script',
      'getwd(); writeLines("bill<-140;print(bill)","ticket-cost.R"); source("ticket-cost.R")',
      false,
    ],
    [
      'ps2-script',
      '.workshop_sources=list(list(path=file.path(getwd(),"ticket-cost.R"),original=TRUE)); getwd(); bill=140; print(bill)',
      false,
    ],
    ['ps2-script', 'source("ticket-cost.R")', false],
    ['ps2-script', 'getwd(); print=function(x) invisible(x); source("ticket-cost.R")', false],
    ['ps3-debug', 'x=10; y="apple"; z=15', false],
    ['ps3-debug', 'x=10; y="apple"; z=15; print("15")', false],
    ['ps3-debug', 'x=10; y="apple"; z=15; sink("hidden.txt"); print(z); sink()', false],
    ['ps3-debug', 'x=10; y="apple"; z=15; cat(z,file="hidden.txt")', false],
    ['ps2-script', 'cat(c(getwd(),"\\n")); source("ticket-cost.R")', true],
    ['ps2-script', 'getwd(); base::source("ticket-cost.R")', true],
    ['ps2-script', 'getwd(); local({source("ticket-cost.R")})', true],
    ['ps2-script', 'getwd(); source("ticket-cost.R",local=new.env(parent=baseenv()))', true],
  ]);
  assertCases(results);
  expect(results[6].failed[0]).toContain('Run the supplied ticket-cost.R');
  expect(results[9].failed[0]).toContain('Report the current working directory');
  expect(results[9].failed[0]).not.toContain('There is no value named folder');
  expect(results[10].failed[0]).toContain('Display the bill');
  expect(results[11].failed[0]).toContain('Display z');
});

test('the UI does not claim an unexecuted script printed a result', async ({ page }) => {
  await page.goto('/#ps2-script');
  await page.evaluate(() => window.workshop.setEditor('getwd(); bill=140'));
  await page.getByRole('button', { name: 'Run', exact: true }).click();
  await expect(page.locator('#feedback')).toContainText('Run the supplied ticket-cost.R', {
    timeout: 90000,
  });
  await expect(page.locator('#feedback')).not.toContainText('Code checks passed');
  await expect(page.locator('#feedback')).not.toContainText('The script prints 140');
  await page.evaluate(() =>
    window.workshop.setEditor('cat(getwd(), "\\n"); source("ticket-cost.R")'),
  );
  await page.getByRole('button', { name: 'Run', exact: true }).click();
  await expect(page.locator('#feedback')).toContainText('Code checks passed.');
  await expect(page.locator('#feedback')).toContainText('The supplied script ran successfully');
  await expect(page.locator('#output-panel')).toContainText('[1] 140');
});
