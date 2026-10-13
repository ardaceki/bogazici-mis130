# Validation

Validated on **13 October 2026** against the local production build.
Release notes identify the commit and live verification of published versions.

## Automated checks

| Check                        | Result                                                                                                                   |
| ---------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| `npm run check`              | Formatting, lint, deployment-verifier regressions, source links and production build passed                              |
| `npm test`                   | All 50 Chrome browser tests passed                                                                                       |
| Main R solutions             | All 55 coding tasks and 24 guided stages passed, including empty-answer rejection                                        |
| Instructor answers           | All 19 coding answers read directly from the original HTML passed; all 21 practice questions link to instructor sections |
| Alternative answers          | 19 independent approaches and additional audit regressions passed                                                        |
| Source mappings              | All 73 tasks and 71 distinct targets passed                                                                              |
| `npm run check:reproducible` | All 24 output files matched across two builds                                                                            |
| `npm run test:production`    | Served-build byte verification and real-R production smoke passed                                                        |
| Original answer documents    | All four copies match the supplied workspace files byte for byte                                                         |
| Content consolidation        | All 73 task definitions match the pre-refactor snapshot                                                                  |
| `git diff --check`           | Passed                                                                                                                   |

## Coverage

The dependency audit reported zero known vulnerabilities on this date.

The two modules contain 73 tasks: 55 code, 12 choice and 6 written self-review
questions. Practice covers six PS 2 questions, six Lab 2 exercises, four PS 3
problems and five Lab 3 exercises. Lecture 3 is deferred.

The browser suite exercises correct and incomplete answers, wrong values/types/
shapes, precision, equivalent calculations, named and positional lists, native
loops and helper functions, ordered state changes, saved-file execution and
required displays. Output observers are compared with native R for method
arguments, S3 dispatch, exact output and invisible return values. Forged evidence,
redirected output and incomplete execution are rejected.

Runtime checks cover fresh workspaces, function shadowing, options restoration,
expected errors, cancellation/recovery and failed-load retries. UI checks cover
partial feedback, temporary drafts, guided stages, source links, keyboard focus,
navigation, reduced motion and responsive layouts. All 73 initial question views
and guided stages are checked for premature answers; solution visibility and
feedback reset are tested across editing and navigation.

Production smoke verifies the served build before exercising real R, correct/
incorrect answers, audit regressions, error output, object inspection, navigation,
licence notices and the absence of the development test harness. Layout checks
cover 320–1440px viewports. Screenshots and the README images show the actual app.

## Scope and limits

Verification uses macOS Chrome and browser viewports. Physical phones, Safari,
Firefox and assistive technology have not been revalidated. Targeted contrast and
keyboard checks do not establish complete accessibility compliance.

Written reasoning is self-reviewed. RStudio-specific actions are labelled as
desktop work. The observer's supported answer formats and dynamic-code limits
are documented in [answer contracts](ANSWER_AUDIT.md); this learning tool is not
a secure exam sandbox. webR CDN availability is an external dependency.

GitHub Actions runs the project checks on Ubuntu with Node.js 24 and Playwright
Chromium. Consult the Actions result for the specific commit before publication.
For repeatable commands and deployment verification, see
[development](DEVELOPMENT.md).
