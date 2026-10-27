# Validation

Validated on **27 October 2026** against the production build.
Release notes identify the commit and deployment verification for each release.

## Automated checks

| Check                        | Result                                                                                                                               |
| ---------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| `npm run check`              | Formatting, lint, deployment-verifier regressions, source links and production build passed                                          |
| `npm test`                   | All 55 Chrome browser tests passed                                                                                                   |
| Main R solutions             | All 90 coding tasks and 24 guided stages passed, including empty-answer rejection                                                    |
| Instructor answers           | All 33 coding answers read directly from six instructor HTML documents passed; all 35 practice questions link to instructor sections |
| Alternative answers          | 33 independent approaches, all-task syntax/helper variants and existing audit regressions passed                                     |
| New negative cases           | 19 PS 5/Lab 5 value/type/shape/order, copy-mutation and precision cases were rejected                                                |
| Source mappings              | All 116 tasks and 118 distinct source targets passed                                                                                 |
| `npm run check:reproducible` | All 31 output files matched across two builds                                                                                        |
| `npm run test:production`    | Served-build byte verification and real-R production smoke passed, including the new section                                         |
| `npm run deploy:check`       | Wrangler 4.153.0 deployment dry-run passed without publishing                                                                        |
| Original materials           | All six newly added lecture/question/answer files match the supplied originals byte for byte                                         |
| Existing content             | The first two topic modules and guided stages are unchanged; their original instructor answers and browser regressions pass          |
| `git diff --check`           | Passed                                                                                                                               |

## Coverage

The three modules contain 116 tasks: 90 code, 17 choice and nine written
self-review questions. The new Weeks 3–5 group contributes 21 Learn tasks,
14 PS/lab questions (including two optional challenges) and eight paper-practice
questions. Lectures 3–4 provide the topics; PS 5 and Lab 5 provide the practice.
Lecture 5 is not included in this topic group.

The browser suite exercises correct and incomplete answers, wrong values/types/
shapes, precision, equivalent calculations, named and positional lists, native
loops and helper functions, ordered state changes, saved-file execution and
required displays. Output observers are compared with native R for method
arguments, S3 dispatch, exact output and invisible return values. Forged evidence,
redirected output and incomplete execution are rejected.

New regressions cover PS 5's seven vector outputs (where the last vector also
has length seven), coordinate vectors as alternatives to one-row matrices,
integer-vector class reporting, matrix copy preservation, and the balloon
formula's floating-point error. Explicit tolerance for that formula does not
relax discrete answer checks. Each Lab 5 question runs independently of earlier
questions.

Runtime checks cover fresh workspaces, function shadowing, options restoration,
expected errors, cancellation/recovery and failed-load retries. UI checks cover
partial feedback, temporary drafts, guided stages, source links, keyboard focus,
navigation, reduced motion and responsive layouts. Header coverage verifies that
the term and Course map remain visible and usable without overlap or horizontal
overflow on home and lesson screens at 320, 390, 600, 700, 701 and 1440px. All 116 initial question
views and existing guided stages are checked for premature answers. Every wrong
choice has a specific explanation. Solution visibility and feedback reset are
tested across editing and navigation.

Production smoke verifies the served build before exercising real R, correct/
incorrect answers, audit regressions, error output, object inspection, navigation,
licence notices and the absence of the development test harness. It also selects
the new Weeks 3–5 group, checks all three mode entries, runs the original PS 5
vector answer and a wrong alternative, runs independent Lab 5 matrix updates
and the balloon formula, and checks a new paper question. Layout checks cover
320–1440px viewports. Desktop and mobile screenshots are under the ignored
`tests/artifacts/` directory.

The editor dependencies are a separate cacheable production chunk, so growing
course content no longer shares one oversized chunk with CodeMirror. Both
production chunks are below Vite's default size-warning threshold. Reproducibility
and the production checks include this build arrangement.

## Scope and limits

Verification uses macOS Chrome and browser viewports. Physical phones, Safari,
Firefox and assistive technology have not been revalidated. Targeted contrast and
keyboard checks do not establish complete accessibility compliance.

Written reasoning, prediction-before-execution and requested calculation/indexing
methods are self-reviewed. RStudio-specific actions are labelled as desktop work.
The observer's supported answer formats and dynamic-code limits are documented
in [answer contracts](ANSWER_AUDIT.md); this learning tool is not a secure exam
sandbox. webR CDN availability is an external dependency.

On 27 October, both `npm audit` and `npm audit --omit=dev` reported zero
vulnerabilities after updating Wrangler to 4.153.0 and its Undici dependency to
7.30.1. Miniflare now requires Sharp 0.35.5 directly, so the earlier Sharp
override was removed.

GitHub Actions runs the project checks on Ubuntu with Node.js 24 and Playwright
Chromium. Consult the Actions result for the specific commit and the release's
deployment verification when checking what is served. For repeatable commands
and deployment verification, see [development](DEVELOPMENT.md).
