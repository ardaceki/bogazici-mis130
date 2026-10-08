# Validation

Verified locally on **8 October 2026**, after the repository refactor and independent audit fixes.
This document records local validation. Release notes record the commit and
live deployment verification for each published version.

## Independent build verification

On 8 October 2026, two repeated builds and a separate clean installation under
Node.js 24.19.0 produced identical SHA-256 hashes for all 20 output files,
including the generated manifest. The local preview served those exact bytes
and passed the real-R production smoke. Verifier regressions rejected modified
JavaScript, missing files, off-site/misrouted redirects, and an altered manifest. Formatting, lint,
source checks, build, and deployment dry run passed.

After deployment on 8 October 2026, independent verification of
`https://mis130.site` passed: all 20 rebuilt files matched the site's responses
byte for byte. The GitHub Linux artifact also matched the local macOS build.
Live real-R production smoke passed. Same-origin canonical HTML redirects
are followed before comparing bytes; off-site redirects, redirect loops, and
redirects returning different content are rejected. Release notes identify the
commit, tested CI artifact, and Cloudflare deployment version.

## Automated checks

| Check                              | Result                                           |
| ---------------------------------- | ------------------------------------------------ |
| Prettier, ESLint, production build | Passed                                           |
| Course sources                     | 73 task mappings and 50 distinct targets passed  |
| Chrome browser regression suite    | 32 / 32 passed                                   |
| Real browser R solutions           | 55 main solutions plus 24 guided stages passed   |
| Production smoke                   | Passed against the generated static build        |
| Cloudflare deployment dry run      | Passed; no upload/deployment                     |
| Dependency audit                   | Zero known vulnerabilities reported on this date |

The browser suite checks valid and incomplete answers, alternative assignment
syntax, reordered valid structures, wrong names/types/values/dimensions, syntax
errors, fresh environments, worker stop/recovery, failed-load retries, temporary
drafts, guided steps, choice feedback, source dialogs, keyboard focus, drawer
interaction, reduced motion, and responsive layouts.

The production smoke executes real R, verifies correct/incorrect checking,
errors/warnings, menu-return draft preservation, data-frame inspection, the
course map, 320–1440 px overflow behavior, and absence of the development test
harness. Its preview server is started and stopped by the test command.

## Audit fixes and regression coverage

- Student functions cannot replace checker/inspector functions or break the next
  reset. Tests cover local and global function shadowing, options restoration,
  recovery, and `source()` / `save.image()` / `load()` workspace behavior.
- Twenty near-miss and valid-alternative cases cover list/numeric distinctions,
  ±1/±2 integer errors, fresh saved-script execution, matrix contents,
  data-frame/list consistency, and matching diagnostic feedback.
- Drawer Enter/Tab/Escape and guided step transitions retain useful focus.
  Written drafts survive navigation until reload; editing code clears old success.
- Computed normal-text contrast meets 4.5:1 for the tested informational text
  on home, code, choice, written, and privacy screens. This is a targeted contrast
  check, not a complete accessibility certification.
- The static build includes the application licence and 14 dependency notices.
  Production smoke verifies these are served with the build. Node.js 20 was
  removed from the support declaration; verification used Node.js 24.
- A separate copy excluding `node_modules` and generated output passed `npm ci`,
  formatting/lint/source checks, build, production smoke, deployment dry run,
  and dependency audit.
- After the final bitmap cleanup change, five focused runtime/cancellation tests
  passed again; the rebuilt production smoke and deployment dry run also passed.

Feature modules retain the application wiring, execution, runtime,
lesson/editor, home, navigation/dialog, and result-rendering separation.
No framework or production dependency was added. README screenshots and the
GIF remain captures of the actual application.

## Scope and limits

There are 73 tasks: 55 code, 12 answer-selection, and 6 written self-review tasks.
The two published modules cover six PS 2 questions, six Lab 2 exercises, four
PS 3 problems, and five Lab 3 exercises. RStudio-specific actions are labelled
as desktop work. Added prerequisite exercises are identified as preparation.

Verification used local macOS Chrome and desktop/mobile-sized viewports. Physical
phones, Safari, Firefox, and assistive technology have not been revalidated.
See the release notes for live deployment checks. GitHub Actions is configured to run the same checks on Ubuntu
with Node.js 24 and Playwright Chromium. Check the repository Actions tab for
the result associated with a specific commit. CDN availability is an external
dependency; written reasoning is self-reviewed rather than automatically graded.

For the repeatable commands and architecture, see [development](DEVELOPMENT.md).
For question-by-question answer contracts, see [answer audit](ANSWER_AUDIT.md).
