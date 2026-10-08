import { test, expect } from './fixtures.js';

test('answer checks reject wrong types, nearby integer answers, broken saved scripts and inconsistent structures', async ({
  page,
}) => {
  await page.goto('/');
  const results = await page.evaluate(async () => {
    const { runtime, tasks } = window.workshop;
    const cases = [
      {
        id: 'vectors',
        code: 'sales <- list(120,95,140)\nmonths <- length(sales)\ntotal <- 355',
        accepted: false,
      },
      {
        id: 'vectors',
        code: 'sales <- c(120L,95L,140L)\nmonths <- 3L\ntotal <- sum(sales)',
        accepted: true,
      },
      ...[-2, -1, 1, 2].map((offset) => ({
        id: 'lab2-seconds',
        code: `seconds <- ${163220520 + offset}`,
        accepted: false,
      })),
      { id: 'lab2-seconds', code: 'seconds <- 163220520L', accepted: true },
      {
        id: 'lab2-seconds',
        code: '163220522',
        accepted: false,
        calculationMatches: false,
      },
      {
        id: 'lab2-seconds',
        code: '163220520L',
        accepted: false,
        calculationMatches: true,
      },
      {
        id: 'vectors',
        code: 'list(120,95,140)',
        accepted: false,
        calculationMatches: false,
      },
      {
        id: 'repeat-update',
        code: 'history <- 100 * 1.1^(1:3)\nbalance <- history[3]',
        accepted: true,
      },
      {
        id: 'reproduce',
        code: 'bill <- 140\nwriteLines("bill <-", "my-bill.R")',
        accepted: false,
      },
      {
        id: 'reproduce',
        code: 'bill <- 140\nwriteLines("bill <- bill", "my-bill.R")',
        accepted: false,
      },
      {
        id: 'reproduce',
        code: 'writeLines(c("unit_price = 35L", "bill = unit_price * 4L"),"my-bill.R")\nsource("my-bill.R")',
        accepted: true,
      },
      {
        id: 'matrix-names',
        code: 'sales <- matrix(0,nrow=2,ncol=3)\nrownames(sales) <- c("A","B")\ncolnames(sales) <- c("M1","M2","M3")\nsecond_B <- 110',
        accepted: false,
      },
      {
        id: 'matrix-names',
        code: 'sales <- rbind(A=c(M1=120L,M2=95L,M3=140L),B=c(M1=85L,M2=110L,M3=130L))\nsecond_B <- sales[2,2]',
        accepted: true,
      },
      {
        id: 'unclass',
        code: 'df <- data.frame(Z=99)\nraw <- list(A=1:3,B=4:6)\nraw_class <- class(raw)\noriginal_class <- class(df)',
        accepted: false,
      },
      {
        id: 'unclass',
        code: 'df <- data.frame(A=1:3,B=4:6)\nraw <- list(A=1:3,B=4:6,C=7:9)\nraw_class <- class(raw)\noriginal_class <- class(df)',
        accepted: false,
      },
      {
        id: 'unclass',
        code: 'df <- data.frame(B=4:6,A=1:3)\nraw <- unclass(df)\nraw_class <- class(raw)\noriginal_class <- class(df)',
        accepted: true,
      },
      {
        id: 'lists',
        code: 'report <- list(revenue=120,label="October",sales=list(40,30,50))\nunits <- c(40,30,50)',
        accepted: false,
      },
    ];
    const results = [];
    for (const example of cases) {
      const task = tasks.find((candidate) => candidate.id === example.id);
      await runtime.resetTask(task);
      const result = await runtime.run(example.code, task, true);
      results.push({
        ...example,
        error: result.error,
        actual: result.checks.every((validation) => validation.passed),
        failed: result.checks.filter((validation) => !validation.passed).map((x) => x.message),
        firstFeedback: result.checks[0].feedback,
      });
      for (const image of result.images) image.close();
    }
    return results;
  });
  for (const result of results) {
    expect(result.error, JSON.stringify(result)).toBe(false);
    expect(result.actual, JSON.stringify(result)).toBe(result.accepted);
    if (result.calculationMatches !== undefined)
      expect(result.firstFeedback?.includes('calculation is right'), JSON.stringify(result)).toBe(
        result.calculationMatches,
      );
  }
});
