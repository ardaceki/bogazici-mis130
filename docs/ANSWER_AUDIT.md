# Answer contracts and instructor alignment

Reviewed on 27 October 2026.

The three modules contain 116 tasks (90 code, 17 choice, 9 written).
The first two modules retain their 73 tasks. All 35 PS/lab questions are aligned
with the supplied PS 2, Lab 2, PS 3, Lab 3, PS 5 and Lab 5 instructor HTML answers.
Weeks 3–5 pairs Lectures 3–4 with PS 5/Lab 5, whose introductions explicitly
identify those lectures. Week 4 had Quiz 1 rather than PS/lab. Lecture 5 covers
lists and data frames and is not included in this topic group.
The PS 2 instructor document calls its answers suggestions rather than an
assessment rubric; the workshop does not demand identical code or reasoning.

## Source and implementation

`public/sources/{ps2,lab2,ps3,lab3,ps5,lab5}-answers.html` are unchanged copies of the
provided answer documents. Every practice question links to both its original
question and instructor section. `src/content/instructor-solutions.js` transcribes
the executable R chunks, including initialization, without rendered output
comments. PS 2 Q4's intentional error is a separate demonstration, not part of
the runnable solution. PS 2 Q6 uses the task's supplied `ticket-cost.R` file.

`src/content/course-practice.js` is the single source for complete practice task
definitions. The topic modules import its arrays. It specifies metadata, prompts,
accepted answer formats, checks, hints and self-review scope. Learn/guided and paper-practice tasks retain
their existing contracts and code paths. `src/content/course-checks.js` builds
structured answer checks and ordered workspace-state checks.

## Accepted alternatives

- R values are compared by type, shape, length and value, not source text or
  console formatting. Integer/double storage differences are accepted. Numeric
  and logical values remain different types. Discrete expected values use zero
  tolerance; fractional values use an explicit `1e-8` relative tolerance.
- Questions asking for calculations accept the displayed values in question
  order, a final positional vector/list, a named result list using the documented
  entries, or the documented saved answer names. Mixed logical/numeric answers
  must use a list or separate outputs; `c()` coerces them to one type.
- For a displayed sequence, the last N typed outputs are the N answers. Earlier
  diagnostic output is allowed. A list's named entries can be reordered and may
  include extra entries. A positional bundle must have the specified length; labels may be arbitrary. A list is interpreted by semantic keys only when all documented result fields are present; otherwise an exact-length list is read in question order.
- An explicitly recognized saved answer takes precedence over a displayed
  answer; a correct debug print does not hide a wrong saved answer. Aliases are
  resolved in the order shown in the contract. Use one answer name per result to
  avoid ambiguity.
- Helper objects, whitespace, comments, `=`/`<-`, equivalent arithmetic,
  `rbind()`/`matrix()`, and equivalent summary functions are accepted. Required
  matrix names, dimension order, vector order and factor membership still matter.
  Unordered factor level order may differ.
- Display rounding is separate from stored precision. Compound interest asks
  for two-decimal outputs; future value and city populations retain full precision.
  Rounded numbers copied from a rendered R output are not the underlying values.
- Lab 5's balloon-spacing formula involves division and can produce a small
  floating-point error even when the mathematical answer is a whole number.
  Its span, spacing and generated positions use an explicit `1e-8` relative
  tolerance. Discrete vector positions and counts still use zero tolerance.
- An atomic result bundle represents one scalar per field only when every
  expected field is scalar. Otherwise a final vector of the same length as the
  number of fields remains one displayed answer, so PS 5 Q2's seven vector
  answers can be read correctly in order.

## Practice contracts

| Question    | Automatic evidence                                                                                             | Student self-review / adaptation                                                                                     |
| ----------- | -------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| PS 2 Q1     | No prose grading                                                                                               | Four panes; saving versus running; R versus RStudio                                                                  |
| PS 2 Q2     | total_cost = 120; amount_due = 130                                                                             | Predict 120, 130, 120; explain expression versus assignment and comments                                             |
| PS 2 Q3     | Final numeric seat_count = 24 and text room_label; numeric → text "full" → numeric transition                  | Inspect classes and addition; explain quotation marks and reassignment                                               |
| PS 2 Q4     | Both objects created; note removed with score = 8 retained; note recreated, in order                           | List names; predict missing-object error; explain saved script. Use try() to observe the expected error and continue |
| PS 2 Q5     | No prose grading                                                                                               | Two documentation commands; mean; any two relevant help sections with explanations; example() versus help            |
| PS 2 Q6     | Execution of supplied ticket-cost.R; bill = 140 and displayed; reported working directory                      | Run the supplied file; explain path/name checks, fresh sessions, .R versus .RData; save work in desktop RStudio      |
| Lab 2 Ex. 1 | Sum 54; mean 18; product 4914                                                                                  | Direct outputs or bundle or saved names                                                                              |
| Lab 2 Ex. 2 | Difference 8; power 371293; remainder 3                                                                        | Direct outputs or bundle or saved names                                                                              |
| Lab 2 Ex. 3 | i = 12, n = 5; A = 1000 then 500; two-decimal amounts 1762.34, 881.17                                          | Explain why S must be recalculated                                                                                   |
| Lab 2 Ex. 4 | Exact 163220520 seconds                                                                                        | total_seconds, seconds, or displayed result                                                                          |
| Lab 2 Ex. 5 | Full-precision 1000 × 1.08^5                                                                                   | FV or displayed result; rounding a separate display is allowed                                                       |
| Lab 2 Ex. 6 | Four transformations and their product                                                                         | Instructor names, existing aliases, or all five displayed/bundled values; review use of original pi                  |
| PS 3 Q1     | x = 10; y = "apple"; z = 15; script runs and displays the result                                               | Identify bad line and explain incomplete parsing                                                                     |
| PS 3 Q2     | Six numeric/logical operator results                                                                           | Instructor list entries, saved aliases or ordered outputs; explain operators                                         |
| PS 3 Part B | x starts as 4,8,12; extends with three NA; truncates to 4,8, in order                                          | Intermediate object name is optional; explain NA insertion                                                           |
| PS 3 Part C | m contents, 3×4 shape, row/column names; selected value 7 and row/column sums                                  | Instructor result list or displayed results or saved aliases                                                         |
| Lab 3 Ex. 1 | Full-precision cityA, cityB; conserved total 30000                                                             | Review simultaneous annual updates; repeated assignments or equivalent loop allowed                                  |
| Lab 3 Ex. 2 | Full boxes 40; leftover 23                                                                                     | Direct outputs, bundle or saved names; distinguish full boxes from total shipping boxes                              |
| Lab 3 Ex. 3 | Overall 86.05; optional helper names and shapes are unconstrained                                              | Inline mean or saved project; exercise weights are not course grading policy                                         |
| Lab 3 Ex. 4 | Named sales matrix, product totals 355/325, total 680, best month 3                                            | Instructor list, direct outputs or saved answers                                                                     |
| Lab 3 Ex. 5 | Named scores matrix; department/quarter means, best name Sales, real factor with exactly the three departments | Result list, displayed results or saved answers; factor levels may be reordered                                      |

## Runtime evidence and limits

### Weeks 3–5 practice contracts

All new practice tasks use the existing typed answer observer. PS questions
retain prediction and explanation prompts, but neither written reasoning nor
whether the prediction preceded execution is automatically assessed. Requested
functions/indexing methods are self-reviewed: checks compare results rather
than demand a literal spelling of the instructor code.

| Question             | Automatic evidence                                                                                      | Student self-review / adaptation                                                                           |
| -------------------- | ------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| PS 5 Q1              | Three named input vectors, corrected descending sequence, stop order, displayed length                  | Exact predictions, three length inspections, each/times and step-direction explanations                    |
| PS 5 Q2              | Seven vector results, including only the first maximum removed                                          | Positive/negative index diagnosis and repeated-index explanation                                           |
| PS 5 Q3              | Both matrices, dimensions/counts, both positions of 18 and equivalent row-bound arrangement             | Full matrix prediction, filling direction and use of rbind; coordinates may be vectors or one-row matrices |
| PS 5 Q4              | Seven selected values/vectors/matrices with correct order and shape                                     | Structure predictions, column-major order and invalid-row diagnosis                                        |
| PS 5 Q5              | Original and three derived matrices, final route/period names, displayed filtered values                | Single-cell versus whole-row explanation, negative indexing and predicted dimensions                       |
| PS 5 optional        | Reordered display, NA replacement copy, corrected original-size matrix, displayed threshold count       | Operations start from original counts, independently of Q5's extended matrix                               |
| Lab 5 Ex. 1          | Branch vectors, concatenated values, count and matching class report                                    | Integer input is accepted with an accurate integer class report                                            |
| Lab 5 Ex. 2          | Product IDs, branch labels, product pattern and displayed length vector                                 | seq/rep methods and observation alignment                                                                  |
| Lab 5 Ex. 3          | Original retained, corrected/sorted/filter/exclusion results and maximum position                       | Requested displays, indexing and sorting methods                                                           |
| Lab 5 Ex. 4          | Two 3×4 arrangements and displayed dimensions/counts                                                    | Construction methods, printed matrices and dimension interpretation; row-name differences allowed          |
| Lab 5 Ex. 5          | Two vectors and two correctly shaped matrix selections                                                  | Prints and shape explanation                                                                               |
| Lab 5 Ex. 6          | Logical mask, selected vector and count                                                                 | Logical summation and extraction order                                                                     |
| Lab 5 Ex. 7          | Original retained and all three derived matrix values/shapes                                            | Prints and single-cell versus column update explanation                                                    |
| Lab 5 optional Ex. 8 | Named inserted counts, gap counts, span, spacing, endpoint-inclusive positions and displayed difference | Gap modelling, algebra and seq method                                                                      |

Lab inputs needed from earlier exercises are repeated in each task's starter
and instructor solution. No earlier question or previous Run is required.
PS 5's optional challenge and Lab 5's balloon extension are clearly labelled
optional, with the same free navigation as all other questions.

The Lecture 4 source is unchanged. The adapted overwrite exercise explains its
contradictory manually typed output: after `B[,3] <- B[3,]`, `B[2,3]` is 900,
not 105.5. The added `drop=FALSE` lesson is labelled as a workshop bridge.
Connect 4 tasks use explicit initial states and representations; a check of
four specified cells is not presented as a complete game or general win detector.

### Shared runtime behavior

Course code is parsed and evaluated by native R in the fresh lesson workspace.
`src/application/answer-observer.js` records typed values from real print() and
cat() calls in nested local expressions, loops and helper functions, as well as
visible top-level results. Base R print methods whose first argument is x are registered with method-specific
hooks, including print.default, print.factor and print.data.frame. Direct
base:: / base::: references and aliases of those hooks are supported. Standard
method aliases retrieved before a statement are recognized by function identity.
Each hook delegates to the exact original method, preserving its arguments and
invisible return; print.default is not redirected through generic S3 dispatch.
Nested method dispatch records one outer printed value rather than duplicates.
Direct base::cat calls and aliases of its lesson hook are also supported. cat() retains argument types;
numeric-looking text is not reinterpreted as a numeric answer. Whitespace-only
cat() separators do not become answers. Output redirected with an additional
student sink or cat(file=...) does not count as a display to the student.

Native statements receive private observation checkpoints before nested steps,
including for/while/repeat bodies and submitted helper function bodies. This
preserves native return/break/next and final-value visibility. Only requested
lesson-workspace objects are snapshotted, with duplicate states omitted. Quoted
code and formulas remain data. Intermediate changes in separately sourced files,
dynamically generated code or quoted expressions evaluated later are not individually
instrumented; this limit is also stated in the answer contract for state questions.
Snapshots are evidence of observed states, not proof of understanding or a
particular algorithm. Reflection on instrumented function bodies is outside
these ordinary execution guarantees.

PS 2 Q6 records successful source() execution of the supplied file, using its
normalized path and parsed commands. Whitespace and added comments are allowed;
replacing the provided script with a hardcoded bill is rejected. Its generated
bill, numeric display and working-directory report are checked separately. Source-produced values are read from the actual target scope, including native global or explicitly local environments; those choices do not require a new lesson-level bill assignment.
PS 3 Q1 requires a numeric displayed result in addition to saved values.
Source events, output values and state observations are held separately from
student variables. Helper hooks and additional student output sinks are restored
on completion/error; stopping the worker discards that session.

Student variables cannot replace the recorded outputs or state snapshots by
using their internal names. This browser learning tool is not a secure exam
sandbox and does not claim resistance to deliberate introspection of R call
frames. Checks do not prove that a student used the instructor's formula rather
than typing the right values, or that explanatory prose is correct.

A bare intentional error stops a script. The UI explains that PS 2 Q4's error
was displayed separately by the instructor, and suggests try(print(ps01_note))
for a single runnable demonstration. Each UI run resets values, options and files;
previous successful values or traces cannot make an incomplete later run pass.

Success says **Code checks passed**, then gives the numeric explanation and any
self-review scope. Wrong answers identify partial success and the failed value,
type, shape or missing step. Written answers never receive automatic correctness.

Review notes can contain computed values and explanations. The shared lesson
renderer never puts these notes below the initial editor: they appear only in
an explicitly opened solution or after a successful code check. Closing the
solution removes its notes; editing clears feedback, and changing questions
resets both solution and feedback. Initial answer-format guidance remains in
How to answer. Practice prompts state the task and supplied inputs without
giving away a diagnosis or calculation method that the question asks students
to discover. Learn examples still provide their intended teaching instructions.

`tests/answer-disclosure.spec.js` checks the initial state of all 116 questions
and their guided stages, specific premature-answer regressions, and the explicit
solution/check/edit/navigation lifecycle. The production smoke checks the same
ticket-output disclosure regression without the development harness.

## Verification

`tests/instructor-answers.spec.js` reads all 19 coding answers directly from the
four HTML documents, independently of the task solution strings. It also checks
19 different correct approaches, incorrect values/types/shapes/precision,
skipped or reversed transitions, forged evidence, expected-error behavior,
grouped-statement visibility, fresh runs, all 35 source mappings, partial-result
feedback and the 320px layout. The existing all-solution tests still cover
90 main coding solutions and 24 guided stages. See `VALIDATION.md` for executed
commands and their results. Physical devices and assistive technology are outside
this automated validation.

`tests/vectors-matrices.spec.js` independently reads all 14 new coding answers
from the PS 5/Lab 5 HTML, including prerequisite initialization. It verifies
14 alternative calculations/formats and 19 incorrect value/type/shape/order,
copy-mutation and precision cases. It also covers the third course selector
entry, all three modes, all new practice source links and a real-R 320px flow.
The shared all-solution and initial-disclosure tests include the new module.

`tests/audit-regressions.spec.js` reproduces all eight examples in the independent
audit. It also covers native control flow, aliases/namespaced output, quoted data,
ordered lists with arbitrary labels, optional helper shapes, original-file execution,
comment-only file edits, suppressed/file-directed output, numeric/text displays,
forged source events and the actual success/failure UI.

The print.default re-audit regression includes namespace and unqualified calls,
loops/local expressions, aliases, method lookup and do.call. Wrong values, text
numbers and sink-redirected output remain rejected. A native-versus-observed
comparison checks exact output, default-method dispatch, forwarded arguments,
factors/matrices/lists, and invisible return values.
