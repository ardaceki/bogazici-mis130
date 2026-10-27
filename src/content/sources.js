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

const vectorsLecture = (anchor, section) => html('lecture-3', anchor, `Lecture 3 · ${section}`);
const matricesLecture = (anchor, section) => html('lecture-4', anchor, `Lecture 4 · ${section}`);
const vectorsDeep = {
  combine: vectorsLecture('vectors-in-r', '1.1 · Vectors and combination'),
  seq: vectorsLecture('sequences-with-seq-in-r', '1.3 · Sequences'),
  rep: vectorsLecture('repetition-with-rep-in-r', '1.4 · Repetition'),
  sort: vectorsLecture('sorting-with-sort-in-r', '1.5 · Sorting'),
  subset: vectorsLecture('subsetting-and-element-extraction-in-r', '1.6 · Subsetting'),
  negative: vectorsLecture(
    'removing-elements-with-negative-indexing-in-r',
    '1.7 · Negative indexing',
  ),
  indexes: vectorsLecture('indexing-with-vectors-of-indexes-in-r', '1.8 · Index vectors'),
  change: vectorsLecture('modifying-elements-in-a-vector-in-r', '1.9 · Modifying elements'),
  clocks: vectorsLecture(
    'mini-program-solving-the-hotel-clocks-question-in-r',
    '1.10 · Hotel clocks',
  ),
};
const matricesDeep = {
  filling: matricesLecture('filling-direction', '2.2 · Filling direction'),
  binding: matricesLecture('row-and-column-bindings', '2.3 · Row and column binding'),
  subset: matricesLecture('selecting-specific-rows-and-columns', '5.3 · Subsetting'),
  negative: matricesLecture('omitting-and-overwriting', '6 · Negative indexes'),
  overwrite: matricesLecture('overwriting-matrix-elements', '7.2 · Overwriting'),
  diagonal: matricesLecture('extracting-main-diagonal-elements', '5.4 · Main diagonal'),
  offset: matricesLecture('off-main-diagonal-elements', '5.5.5 · Offset diagonals'),
  cells: matricesLecture('connect-4-matrix-overwriting-exercises', '8 · Connect 4 updates'),
  lowest: matricesLecture('finding-the-lowest-available-row-in-a-column', '4.1 · Lowest empty row'),
  character: matricesLecture('making-a-move', '9.1–9.3 · Character boards'),
};
for (const [ids, refs] of [
  ['vector-combine', [vectorsDeep.combine]],
  ['vector-seq-step vector-seq-length', [vectorsDeep.seq]],
  ['vector-repeat paper-repeat-pattern', [vectorsDeep.rep]],
  ['vector-sort', [vectorsDeep.sort]],
  ['vector-index-order', [vectorsDeep.indexes]],
  ['vector-negative paper-first-maximum', [vectorsDeep.negative]],
  ['vector-logical', [vectorsDeep.subset]],
  ['vector-overwrite', [vectorsDeep.change]],
  ['vector-clocks paper-vector-plan', [vectorsDeep.clocks]],
  ['matrix-fill-direction paper-matrix-direction', [matricesDeep.filling]],
  ['matrix-bind', [matricesDeep.binding]],
  ['matrix-subset-order', [matricesDeep.subset]],
  ['matrix-exclude-shape paper-matrix-drop', [matricesDeep.negative]],
  ['matrix-overwrite-sequence', [matricesDeep.overwrite]],
  ['matrix-diagonal', [matricesDeep.diagonal]],
  ['matrix-offset-diagonal', [matricesDeep.offset]],
  ['connect4-cells', [matricesDeep.cells]],
  ['connect4-lowest', [matricesDeep.lowest]],
  ['connect4-character', [matricesDeep.character]],
  ['paper-index-diagnosis', [vectorsDeep.indexes]],
])
  link(ids, refs);
taskSources['matrix-exclude-shape'].note =
  'Based on the lecture’s dimension-dropping examples. drop=FALSE is an added bridge for preserving matrix shape.';
taskSources['matrix-overwrite-sequence'].note =
  'Based on Lecture 4 §7.2. Its second manually typed Output block incorrectly gives B[2,3] as 105.5. The executable example and verified R result give 900.';
const ps5Anchors = [
  'q1.-trace-vector-construction---8-minutes',
  'q2.-trace-filter-and-diagnose-indexes---10-minutes',
  'q3.-reason-about-matrix-filling---10-minutes',
  'q4.-predict-matrix-subsets---10-minutes',
  'q5.-repair-and-restructure-a-passenger-count-table---12-minutes',
  'optional-challenge',
];
for (const [index, id] of [
  'ps5-construction',
  'ps5-indexing',
  'ps5-filling',
  'ps5-subsets',
  'ps5-repair',
  'ps5-challenge',
].entries())
  link(id, [
    html('ps-5', ps5Anchors[index], `PS 5 · ${index < 5 ? `Q${index + 1}` : 'Optional challenge'}`),
    ...(index < 2
      ? [vectorsDeep.seq, vectorsDeep.indexes]
      : [matricesDeep.filling, matricesDeep.subset, matricesDeep.overwrite]),
  ]);
const lab5Anchors = [
  'exercise-1-create-and-combine-branch-vectors---6-minutes',
  'exercise-2-generate-product-and-branch-identifiers---6-minutes',
  'exercise-3-correct-sort-and-filter-a-sales-vector---8-minutes',
  'exercise-4-build-the-sales-matrix---8-minutes',
  'exercise-5-extract-rows-columns-and-blocks---8-minutes',
  'exercise-6-use-a-logical-matrix---6-minutes',
  'exercise-7-update-and-restructure-the-matrix---8-minutes',
  'exercise-8-balloon-spacing---10-minute-extension',
];
for (const [index, id] of [
  'lab5-combine',
  'lab5-identifiers',
  'lab5-correct',
  'lab5-build',
  'lab5-extract',
  'lab5-logical',
  'lab5-update',
  'lab5-balloons',
].entries())
  link(id, [
    html('lab-5', lab5Anchors[index], `Lab 5 · Exercise ${index + 1}`),
    ...(index < 3 || index === 7
      ? [vectorsDeep.combine, vectorsDeep.seq, vectorsDeep.rep]
      : [matricesDeep.binding, matricesDeep.subset, matricesDeep.overwrite]),
  ]);
link(
  'matrix-logical-order paper-matrix-logical',
  [html('ps-5', ps5Anchors[3], 'PS 5 · Q4'), matricesDeep.offset],
  'Preparation for PS 5 Q4: logical matrix selection and its column-major order. The lecture introduces logical matrix masks in its diagonal example.',
);
link('paper-matrix-repair', [html('ps-5', ps5Anchors[4], 'PS 5 · Q5'), matricesDeep.overwrite]);

// The question and its instructor answer remain separately traceable.
for (const [id, source] of Object.entries(taskSources)) {
  if (!/^(ps|lab)\d+-/.test(id)) continue;
  const question = source.references.find((ref) =>
    /^\/sources\/(ps|lab)-\d+\.html#/.test(ref.href),
  );
  if (!question) throw new Error(`Missing course question for ${id}`);
  const href = question.href.replace(/(ps|lab)-(\d+)\.html/, '$1$2-answers.html');
  source.references.unshift({ label: `Instructor answers · ${question.label}`, href });
  source.note =
    'Question and feedback aligned with the provided instructor answers. Equivalent calculations are accepted; written reasoning is self-reviewed. Browser adaptations are explained in the exercise.';
}
