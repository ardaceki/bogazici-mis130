# Content rights and dependencies

This is an independent student project by Arda Çeki for MIS 130 at Boğaziçi
University. It is not an official or endorsed course website.

## Course materials

Lectures, problem sets, labs, the syllabus, and supplied answer scripts remain
the work of Fahrettin Çakır and the other authors identified in those sources.
Original copies are under `public/sources/`; adapted questions, explanations,
and solutions also draw on those materials. Each published task links to its
source section or PDF page.

The workshop includes the provided instructor HTML answers for
PS 2, Lab 2, PS 3 and Lab 3. Their original bytes are preserved, and each
practice task links to its answer section as well as the question. Lecture 3
is not included. These answer documents retain the same
author attribution and course-material exclusions described below.

Rights to the original teaching materials remain with their respective authors.
These materials, including course-derived exercise text, examples, hints, and
solutions, are excluded from the application software licence.

## Project licence

Original application code is licensed under the [MIT License](../LICENSE),
copyright (c) 2026 Arda Çeki. This licence does not relicense original course
materials in `public/sources/` or course-derived educational content embedded in
the workshop. Third-party content and dependencies retain their own rights and
terms.

## Third-party software

| Component                               | Licence / source                                                                      |
| --------------------------------------- | ------------------------------------------------------------------------------------- |
| CodeMirror                              | [MIT](https://github.com/codemirror/dev/blob/main/LICENSE)                            |
| Vite                                    | [MIT](https://github.com/vitejs/vite/blob/main/LICENSE)                               |
| Playwright                              | [Apache-2.0](https://github.com/microsoft/playwright/blob/main/LICENSE)               |
| webR JavaScript and supporting code     | [MIT, unless otherwise noted](https://github.com/r-wasm/webr/blob/v0.6.0/LICENSE.md)  |
| webR distribution binaries containing R | [GPL-3.0](https://github.com/r-wasm/webr/blob/v0.6.0/LICENSE.md)                      |
| DM Sans                                 | [SIL Open Font License](https://github.com/google/fonts/blob/main/ofl/dmsans/OFL.txt) |

The runtime loads from the pinned upstream webR 0.6.0 distribution. Its upstream
notice lists additional bundled components and their source/licence locations.
Dependency notices are not replaced by the project MIT licence.

The static build includes [software licence notices](../public/THIRD_PARTY_NOTICES.txt),
available in the repository; the website footer links to the GitHub repository. `npm run build` regenerates them from the
installed browser dependencies and the application `LICENSE`. The webR notice is
preserved in full, along with the notice for msgpack embedded in its browser entry.
When upgrading webR, review its bundled dependencies in `scripts/build-notices.mjs`.
