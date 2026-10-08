const pdf = (page, section) => ({
  label: `Lecture 1 · ${section} · p. ${page}`,
  href: `/sources/lecture-1.pdf#page=${page}`,
});
const html = (file, anchor, label) => ({ label, href: `/sources/${file}.html#${anchor}` });
const lecture = (anchor, section) => html('lecture-2', anchor, `Lecture 2 · ${section}`);
const intro = {
  calculation: pdf(9, '1.8 · Calculation example'),
  assignment: pdf(14, '1.13 · Creating variables'),
  comments: pdf(9, '1.8 · Comments'),
  workspace: pdf(8, '1.7 · Objects and workspace'),
  remove: pdf(15, '1.14 · Removing variables'),
  studio: pdf(6, '1.5 · R and RStudio'),
  directory: pdf(10, '1.9 · Working directory'),
  source: pdf(7, '1.6 · Executing scripts'),
  scripts: pdf(12, '1.11 · Scripts'),
  save: pdf(11, '1.10 · Saving work'),
  help: pdf(13, '1.12 · Help system'),
};
const foundations = {
  syntax: lecture('understanding-r-syntax', '1 · Syntax'),
  operators: lecture('arithmetic-comparison-and-logical-operators', '2.1 · Operators'),
  workspace: lecture('managing-objects-in-r', '3.1 · Workspace'),
  vectors: lecture('types-of-r-objects-data-structures', '3.2 · Vectors'),
  matrices: lecture('types-of-r-objects-matrices', '3.3 · Matrices'),
  lists: lecture('types-of-r-objects-lists', '3.4 · Lists'),
  frames: lecture('types-of-r-objects-data-frames', '3.5 · Data frames'),
  factors: lecture('types-of-r-objects-factors', '3.6 · Factors'),
  conversion: lecture('objects-length-and-attributes-in-r', '4 · Length and conversion'),
  length: lecture('changing-the-length-of-an-object', '4.1 · Changing length'),
  attributes: lecture('getting-and-setting-attributes-in-r', '4.2 · Attributes'),
  classes: lecture('the-class-of-an-object-in-r', '4.3 · Class'),
  labels: lecture('opening-challenge-clothing-labels', 'Opening challenge'),
};
const ps2Anchors = [
  'q1.-where-does-the-work-happen',
  'q2.-predict-run-and-explain',
  'q3.-numbers-and-text',
  'q4.-remove-an-object-keep-the-script',
  'q5.-ask-r-for-help',
  'q6.-save-today-reproduce-tomorrow',
];
const ps2 = (n) => html('ps-2', ps2Anchors[n - 1], `PS 2 · Q${n}`);
const lab2 = (n) => html('lab-2', `lab-exercise-${n}`, `Lab 2 · Exercise ${n}`);
const lab3Anchors = [
  'exercise-1',
  'exercise-2-packaging-leftovers',
  'exercise-3-weighted-course-grade',
  'exercise-4-monthly-sales-roll-up',
  'exercise-5-department-performance-report',
];
const lab3 = (n) => html('lab-3', lab3Anchors[n - 1], `Lab 3 · Exercise ${n}`);
const ps3 = {
  syntax: html('ps-3', 'q1.-syntax-debugging', 'PS 3 · Q1'),
  operators: html('ps-3', 'q2.-operator-practice', 'PS 3 · Q2'),
  length: html('ps-3', 'problem-changing-object-length', 'PS 3 · Changing length'),
  matrix: html('ps-3', 'problem-matrices-and-indexing', 'PS 3 · Matrices and indexing'),
};
const answer = (n) => ({
  label: `Provided answer · Lab 3 · q${n}.R`,
  href: `/sources/lab-3-q${n}.R.txt`,
});
const quick = html('lab-2', 'quick-reference', 'Lab 2 · Quick reference');
export const taskSources = {};
function link(ids, refs, note = 'Original workshop exercise based on these sections.') {
  for (const id of ids.split(' ')) taskSources[id] = { references: refs, note };
}
link('first-calculation change-number', [intro.calculation]);
link('multiply ticket-calculation order', [quick, intro.calculation]);
link('assignment number-text reassignment', [intro.assignment]);
link('expression-state', [ps2(2), intro.assignment]);
link('comments', [intro.comments]);
link('workspace', [intro.workspace, intro.remove]);
link('rstudio', [intro.studio]);
link('working-directory', [intro.directory]);
link('scripts', [intro.source, intro.scripts]);
link(
  'reproduce',
  [intro.scripts, intro.save],
  'Preparation exercise based on scripts and saving work. writeLines() lets you practise saving a script in the browser; it is an added helper, not a Lecture 1 requirement.',
);
link('help', [intro.help]);
for (const [id, n, refs] of [
  ['ps2-panes', 1, [intro.studio]],
  ['ps2-tickets', 2, [intro.assignment, intro.comments]],
  ['ps2-types', 3, [intro.assignment]],
  ['ps2-remove', 4, [intro.remove]],
  ['ps2-help', 5, [intro.help]],
  ['ps2-script', 6, [intro.directory, intro.source, intro.scripts]],
])
  link(id, [ps2(n), ...refs], 'Adapted from the original PS question.');
for (const [id, n] of [
  ['lab2-three', 1],
  ['lab2-operators', 2],
  ['lab2-compound', 3],
  ['lab2-seconds', 4],
  ['lab2-future', 5],
  ['lab2-pi', 6],
])
  link(id, [lab2(n), quick], 'Adapted from the original lab exercise.');
link('paper-fee paper-write', [ps2(2), intro.assignment]);
link('paper-quotes', [ps2(3), intro.assignment]);
link('paper-script', [ps2(6), intro.scripts]);
link('paper-delete', [ps2(4), intro.remove]);
link('syntax', [foundations.syntax]);
link('division comparisons logic', [foundations.operators]);
link('vectors sequences character-vectors coercion', [foundations.vectors]);
link('index', [foundations.vectors, foundations.matrices]);
link('length beyond-length', [foundations.length]);
link('matrix matrix-names', [foundations.matrices]);
link(
  'summaries',
  [ps3.matrix, lab3(4), answer(4), lab3(5), answer(5)],
  'Added preparation for the matrix summaries used in PS 3 and Lab 3.',
);
link('lists', [foundations.lists]);
link('dataframes', [foundations.frames]);
link('factors ordered-factor', [foundations.factors]);
link('conversion', [foundations.conversion]);
link('attributes', [foundations.attributes]);
link(
  'unclass',
  [foundations.classes],
  'Based on the lecture’s class section. Its comment that class(unclass(df)) is NULL is incorrect; the verified R result is "list".',
);
link(
  'labels',
  [foundations.labels],
  'Adapted from the lecture’s opening challenge; the cut labels are translated to English.',
);
link(
  'repeat-update',
  [lab3(1), answer(1), foundations.workspace],
  'Added loop preparation for the two-city lab problem. The lecture also shows a for loop in its workspace example; full control flow comes later in the syllabus.',
);
for (const [id, key, ref] of [
  ['ps3-debug', 'syntax', foundations.syntax],
  ['ps3-operators', 'operators', foundations.operators],
  ['ps3-length', 'length', foundations.length],
  ['ps3-matrix', 'matrix', foundations.matrices],
])
  link(id, [ps3[key], ref], 'Adapted from the original PS problem.');
for (const [id, n, refs] of [
  ['lab3-population', 1, []],
  ['lab3-boxes', 2, [foundations.operators]],
  ['lab3-grade', 3, [foundations.vectors]],
  ['lab3-sales', 4, [foundations.matrices]],
  ['lab3-departments', 5, [foundations.matrices, foundations.factors]],
])
  link(id, [lab3(n), answer(n), ...refs], 'Adapted from the original lab exercise.');
link('paper-modulo', [foundations.operators, ps3.operators]);
link('paper-matrix', [foundations.matrices]);
link('paper-list', [foundations.lists]);
link('paper-na', [foundations.length]);
link('paper-factor', [foundations.factors]);
link('paper-class', [foundations.classes], taskSources.unclass.note);
link('paper-simultaneous', [lab3(1)]);
link('paper-summary', [lab3(5), ps3.matrix]);
