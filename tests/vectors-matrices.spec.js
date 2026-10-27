import { test, expect } from './fixtures.js';

// Read source chunks independently from the task solution strings. Include the
// earlier lab inputs because each individual task starts in a fresh workspace.
const sourceCases = [
  ['ps5-construction', 'ps5', [1, 2, 3, 4, 5, 6, 7, 8]],
  ['ps5-indexing', 'ps5', [9, 10, 11, 12, 13, 14, 15, 16]],
  ['ps5-filling', 'ps5', [18, 19, 20, 21, 22, 23, 24, 25]],
  ['ps5-subsets', 'ps5', [26, 27, 28, 29, 30, 31, 32, 33]],
  ['ps5-repair', 'ps5', [34, 35, 36, 37, 38, 39]],
  ['ps5-challenge', 'ps5', [34, 40, 41, 42]],
  ['lab5-combine', 'lab5', [0, 1, 2]],
  ['lab5-identifiers', 'lab5', [0, 3, 4, 5, 6]],
  ['lab5-correct', 'lab5', [7, 8, 9, 10, 11, 12]],
  ['lab5-build', 'lab5', [0, 13, 14, 15, 16, 17]],
  ['lab5-extract', 'lab5', [0, 13, 18, 19, 20, 21]],
  ['lab5-logical', 'lab5', [0, 13, 22, 23, 24]],
  ['lab5-update', 'lab5', [0, 13, 25, 26, 27]],
  ['lab5-balloons', 'lab5', [28, 29, 30, 31, 32]],
];

test('all PS 5 and Lab 5 instructor answers pass directly from the supplied HTML', async ({
  page,
}) => {
  await page.goto('/');
  const failures = await page.evaluate(async (cases) => {
    const documents = {};
    for (const source of ['ps5', 'lab5']) {
      const response = await fetch(`/sources/${source}-answers.html`);
      if (!response.ok) throw new Error(`Missing ${source} source`);
      const doc = new DOMParser().parseFromString(await response.text(), 'text/html');
      documents[source] = [...doc.querySelectorAll('pre.r code')].map((node) => node.textContent);
    }
    const { runtime, tasks } = window.workshop;
    const failures = [];
    for (const [id, source, chunks] of cases) {
      const code = chunks
        .map((index) => {
          if (!documents[source][index]) throw new Error(`Missing ${source} chunk ${index}`);
          return documents[source][index];
        })
        .join('\n');
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
  }, sourceCases);
  expect(failures).toEqual([]);
});

test('Weeks 3–5 accept alternative calculations, named bundles and coordinate vectors', async ({
  page,
}) => {
  await page.goto('/');
  const failures = await page.evaluate(async () => {
    const { runtime, tasks } = window.workshop;
    const starter = (id) => tasks.find((t) => t.id === id).starter;
    const cases = [
      [
        'ps5-construction',
        'route_id=seq(210,245,length.out=8);zone_times=rep(c("N","S"),4);zone_each=rep(c("N","S"),each=4);descending=rev(seq(3,12,3));stop_order=c(seq(1,7,2),seq(2,8,2));length(route_id);length(zone_times);length(zone_each)',
      ],
      [
        'ps5-indexing',
        starter('ps5-indexing') +
          '\nlist(keep_without_second=delay[c(1,3:8)],middle_values=subset(delay,delay>=4 & delay<10),without_first_max=delay[-which.max(delay)],repeated=delay[c(8,3,3,1)],excluded=delay[-c(2,6)],large=delay[delay>=7],selected=delay[c(1,4,8)])',
      ],
      [
        'ps5-filling',
        'by_column=cbind(11:13,14:16,17:19,20:22);by_row=rbind(11:14,15:18,19:22);dimensions=dim(by_column);rows=dim(by_row)[1];columns=dim(by_row)[2];column_position=c(2,3);row_position=c(2,4);by_row_with_rbind=by_row',
      ],
      [
        'ps5-subsets',
        starter('ps5-subsets') +
          '\nlist(selected_matrix=traffic[c("R1","R3"),-2],correct_cell=traffic["R2","14"],at_least_30=traffic[traffic>=30],reordered=traffic[c("R3","R1"),c("14","10")],block=traffic[1:2,c(1,4)],second_column=traffic[,"10"],cell=traffic["R2","12"])',
      ],
      [
        'ps5-repair',
        starter('ps5-repair') +
          '\ncounts_clean=counts;counts_clean["B","P2"]=41;counts_clean[,"P4"]=c(56,51,50);counts_extended=rbind(counts_clean,D=c(40,46,52,54));counts_reduced=counts_extended[,-2];print(counts_reduced[counts_reduced>=50])',
      ],
      [
        'ps5-challenge',
        starter('ps5-challenge') +
          '\nprint(counts[,c("P4","P1")]);counts_with_na=counts;counts_with_na[counts_with_na>100]=NA;counts_corrected=counts;counts_corrected[2,2]=41;cat(length(which(counts_corrected>=50)))',
      ],
      [
        'lab5-combine',
        'branch_a=c(42L,35L,51L,28L);branch_b=c(45L,31L,58L,33L);branch_c=c(40L,39L,55L,30L);all_sales=append(append(branch_a,branch_b),branch_c);observation_count=length(all_sales);sales_class=class(all_sales)',
      ],
      [
        'lab5-identifiers',
        starter('lab5-identifiers') +
          '\nproduct_ids=seq(101,104,length.out=4);branch_labels=rep(c("A","B","C"),each=4);product_pattern=rep(product_ids,times=3);c(length(branch_labels),length(product_pattern),length(all_sales))',
      ],
      [
        'lab5-correct',
        starter('lab5-correct') +
          '\nbranch_b_corrected=replace(recorded_b,2,31);branch_b_desc=branch_b_corrected[order(-branch_b_corrected)];best_product_position=which.max(branch_b_corrected);target_sales=subset(branch_b_corrected,branch_b_corrected>=40);first_three=head(branch_b_corrected,3)',
      ],
      [
        'lab5-build',
        starter('lab5-build') +
          '\nsales=t(cbind(branch_a,branch_b,branch_c));sales_from_matrix=matrix(c(branch_a,branch_b,branch_c),ncol=4,byrow=TRUE);dim(sales);dim(sales)[1];dim(sales)[2]',
      ],
      [
        'lab5-extract',
        starter('lab5-extract') +
          '\nbranch_b_sales=sales["branch_b",];product_3_sales=sales[,3];selected_block=sales[c(1,2),c(2,3,4)];corner_sales=sales[c(1,3),c(1,4)]',
      ],
      [
        'lab5-logical',
        starter('lab5-logical') +
          '\ntarget_matrix=!(sales<50);high_sales=sales[target_matrix];target_count=length(high_sales)',
      ],
      [
        'lab5-update',
        starter('lab5-update') +
          '\nsales_updated=sales;sales_updated["branch_b",2]=37;sales_updated[,4]=c(30,34,32);sales_extended=rbind(sales_updated,c(44,36,52,29));sales_reduced=sales_extended[,c(1,3,4)]',
      ],
      [
        'lab5-balloons',
        'inserted=c(white=2,yellow=4);gap_counts=inserted+1;span=18*prod(gap_counts)/diff(gap_counts);spacing=span/gap_counts;white_positions=seq(0,span,by=spacing[1]);yellow_positions=seq(0,span,by=spacing[2]);diff(rev(spacing))',
      ],
    ];
    const failures = [];
    for (const [id, code] of cases) {
      const task = tasks.find((t) => t.id === id);
      await runtime.resetTask(task);
      const result = await runtime.run(code, task, true);
      if (result.error || result.checks.some((c) => !c.passed))
        failures.push({
          id,
          output: result.output,
          failed: result.checks.filter((c) => !c.passed),
        });
      for (const image of result.images) image.close();
    }
    return failures;
  });
  expect(failures).toEqual([]);
});

test('new checks reject wrong values, shapes, order, copy mutations and coarse rounding', async ({
  page,
}) => {
  await page.goto('/');
  const failures = await page.evaluate(async () => {
    const { runtime, tasks } = window.workshop;
    const cases = [
      ['ps5-construction', 'zone_each <- zone_times'],
      ['ps5-indexing', 'without_first_max <- delay[delay != max(delay)]'],
      ['ps5-indexing', 'selected <- c(8,5,4.00001)'],
      ['ps5-subsets', 'at_least_30 <- sort(at_least_30)'],
      ['ps5-subsets', 'selected_matrix <- as.vector(selected_matrix)'],
      ['ps5-repair', 'counts_clean[2,] <- 41'],
      ['ps5-repair', 'counts_reduced <- counts_reduced[4:1,]'],
      ['ps5-repair', 'colnames(counts_reduced) <- c("X","Y","Z")'],
      ['ps5-challenge', 'counts_corrected[1,2] <- 49'],
      ['lab5-combine', 'all_sales <- as.character(all_sales)'],
      ['lab5-identifiers', 'branch_labels <- rep(c("A","B","C"),times=4)'],
      ['lab5-correct', 'recorded_b[2] <- 31'],
      ['lab5-build', 'sales <- as.vector(sales)'],
      ['lab5-extract', 'product_3_sales <- sales[,3,drop=FALSE]'],
      ['lab5-logical', 'target_matrix <- target_matrix*1'],
      ['lab5-update', 'sales_reduced <- sales_updated[,-2]'],
      ['lab5-balloons', 'span <- 134.99'],
      ['lab5-balloons', 'white_positions <- c(45,90,135)'],
      ['lab5-balloons', 'spacing <- as.character(spacing)'],
    ];
    const failures = [];
    for (const [id, mutation] of cases) {
      const task = tasks.find((t) => t.id === id);
      await runtime.resetTask(task);
      const result = await runtime.run(task.solution + '\n' + mutation, task, true);
      if (!result.error && result.checks.every((c) => c.passed)) failures.push({ id, mutation });
      for (const image of result.images) image.close();
    }
    return failures;
  });
  expect(failures).toEqual([]);
});

test('new section opens all modes, preserves source provenance and works on mobile', async ({
  page,
}) => {
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto('/');
  await page.locator('#course-unit').click();
  await page.getByRole('option', { name: /Weeks 3–5/ }).click();
  await expect(page.locator('#unit-source')).toHaveText('Lectures 3–4 · PS 5 · Lab 5');
  for (const [mode, count, id] of [
    ['learn', 21, 'vector-combine'],
    ['practice', 14, 'ps5-construction'],
    ['exam', 8, 'paper-repeat-pattern'],
  ]) {
    const link = page.locator(`[data-open-mode="${mode}"]`);
    await expect(link).toContainText(`${count} exercises`);
    await link.click();
    await expect(page).toHaveURL(new RegExp(`#${id}$`));
    await page.locator('.brand').click();
  }
  await page.locator('#course-info').click();
  await expect(page.locator('.course-ready')).toContainText('Vectors & matrices');
  await expect(page.locator('.future-list')).not.toContainText('Vectors in depth');
  await expect(page.locator('.future-list')).toContainText('Lists, data frames');
  await page.locator('#info-dialog').getByRole('button', { name: 'Close dialog' }).click();
  const sources = await page.evaluate(() =>
    window.workshop.tasks
      .filter((t) => t.moduleId === 'vectors-matrices' && t.mode === 'practice')
      .map((t) => t.id),
  );
  expect(sources).toHaveLength(14);
  for (const id of sources) {
    await page.evaluate((id) => window.workshop.navigate(id), id);
    await page.getByRole('button', { name: 'Source ↗', exact: true }).click();
    await expect(page.locator('#source-body a').first()).toHaveAttribute(
      'href',
      /\/sources\/(ps5|lab5)-answers\.html#/,
    );
    await expect(page.locator('#source-body')).toContainText('Instructor answers');
    await page.getByRole('button', { name: 'Close source material' }).click();
  }
  await page.setViewportSize({ width: 320, height: 850 });
  await page.goto('/#lab5-update');
  await expect(page.locator('#solution')).toHaveCount(0);
  await page.getByRole('button', { name: 'Show solution', exact: true }).click();
  await page.getByRole('button', { name: 'Use in editor' }).click();
  await page.getByRole('button', { name: 'Run', exact: true }).click();
  await expect(page.locator('#feedback')).toContainText('Code checks passed.', { timeout: 90000 });
  await page.getByRole('tab', { name: /Objects/ }).click();
  await expect(page.locator('#objects-panel')).toContainText('sales_reduced');
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.screenshot({ path: 'tests/artifacts/vectors-matrices-mobile.png', fullPage: true });
  expect(errors).toEqual([]);
});
