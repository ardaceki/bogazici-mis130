# Development

## Setup and checks

Use Node.js 24 (see `.nvmrc`), or a supported Node.js 22 release listed in
`package.json`. Node.js 20 is not supported by the deployment tools.
The lockfile records the dependency versions.
For byte-for-byte release verification, use the exact Node.js version in `.nvmrc`.

```sh
npm ci
npm run dev
```

Vite serves the workshop at `http://127.0.0.1:5173`. R loads from the pinned
webR CDN when a coding exercise opens; an internet connection is needed.

| Command                   | Purpose                                                                |
| ------------------------- | ---------------------------------------------------------------------- |
| `npm run format`          | Format project code and documentation.                                 |
| `npm run check`           | Check formatting, JavaScript lint, source links, and production build. |
| `npm test`                | Run the browser regression suite against its own server on port 5174.  |
| `npm run test:production` | Start a local preview, smoke-test the existing build, and stop it.     |
| `npm run preview`         | Inspect the production output manually.                                |
| `npm run deploy:check`    | Dry-run the Cloudflare deployment.                                     |
| `npm run deploy`          | Build and publish to the configured Cloudflare account/domain.         |

Tests use local Chrome, or the executable specified by
`PLAYWRIGHT_CHROMIUM_EXECUTABLE`. In CI, install and use Playwright's Chromium:

```sh
npx playwright install --with-deps chromium
CI=1 npm test
```

The test server does not watch files, so a filesystem event cannot reset an R
session in the middle of a test. Tests are serial because each page boots its
own interpreter. Screenshots, traces, reports, builds, and local Wrangler state
are ignored by Git. A failed CI run retains diagnostics for seven days.

`WORKSHOP_PREVIEW_URL` makes the production smoke target an existing deployment
instead of starting a local preview. `WORKSHOP_HOST_RESOLVER_RULES` optionally
supplies Chromium DNS overrides; certificate verification stays enabled.

## Code map

| Location                                    | Responsibility                                                                         |
| ------------------------------------------- | -------------------------------------------------------------------------------------- |
| `index.html`, `privacy.html`                | Static page structure and document metadata.                                           |
| `src/main.js`                               | Connect features and route URL fragments to home or a lesson.                          |
| `src/application/execution.js`              | Coordinate Run/Stop, time limits, cancellation, and feedback.                          |
| `src/runtime.js`                            | Initialize webR, isolate R environments/files, evaluate checks, and serialize results. |
| `src/ui/home.js`                            | Course selection and study-mode entry; dispose page-level picker listeners.            |
| `src/ui/lesson.js`                          | Lesson rendering, editor ownership, temporary drafts, hints, and solutions.            |
| `src/ui/editor.js`                          | CodeMirror configuration and keyboard bindings.                                        |
| `src/ui/results.js`                         | Output, plots, object inspection, tabs, and responsive placement.                      |
| `src/ui/navigation.js`, `src/ui/dialogs.js` | Exercise drawer and source/course/material dialogs.                                    |
| `src/ui/html.js`                            | Escape text and render the small inline-code/paragraph format.                         |
| `src/feedback.js`                           | Answer contracts and human-readable diagnostics.                                       |
| `src/content/`                              | Course modules, guided stages, helpers, and source mappings.                           |
| `src/styles/`                               | Base controls, layout, lessons, home, dialogs, privacy, and motion.                    |
| `tests/`, `scripts/`                        | Browser behavior checks and project verification utilities.                            |

Feature modules expose small explicit methods. UI modules do not import the
entry point or start R themselves. The execution controller owns the interpreter;
the lesson owns the editor and drafts. Pending runs are invalidated on navigation.
Text inserted into HTML passes through the shared escaping helpers. The project
uses ES modules and plain DOM APIs; no component framework or state library is
needed for its current size.

CSS has one base definition per selector in its component file, with nearby
responsive/state rules. `styles/index.css` declares import order. Keep later
changes in the owning component rather than appending overrides elsewhere.
Reduced-motion behavior lives in `styles/motion.css` and `src/motion.js`.

## Adding course content

1. Match lecture topics to the relevant PS/lab questions. File week numbers do
   not necessarily indicate the same topic coverage.
2. Add or extend a module under `src/content/`, then register it in `index.js`.
   A module supplies `id`, `number`, `weeks`, `title`, `subtitle`, `source`,
   `sources`, and `learn`, `practice`, `exam` task arrays.
3. Keep IDs stable: they are shareable URL fragments. Add source mappings in
   `sources.js` and, where permitted, the referenced files in `public/sources/`.
   Original handouts are excluded from automatic formatting.
4. Use `code`, `choice`, or `written` from `helpers.js`. Code checks should
   compare required results and structure, not literal source strings. State
   required object names and distinguish automatic checking from self-review.
5. Put optional staged learning steps in `guided.js`; each stage has its own
   starter, solution, and checks. Put task files in the task's `files` mapping;
   they run in a disposable browser filesystem.
6. Update the roadmap only when a topic becomes published. Run the checks and
   review desktop/mobile behavior. See [answer audit](ANSWER_AUDIT.md).

Written reasoning is self-reviewed. Browser checks accept equivalent calculations
and valid variations in structure where the prompt permits them. Every Run recreates
the task workspace and its files, clears global objects, and restores the initial
R options. It reuses the interpreter; this is not a complete process reset.
Checks and object inspection run separately from student function bindings.
The task workspace supplies `source()` and `save.image()` defaults matching a
console workspace; explicit `source(local=...)` still works.

## Dependencies and deployment

Keep `package-lock.json` in version control and use `npm ci`. The targeted
`miniflare` → `sharp` 0.35.5 override addresses GHSA-wq5f-xc86-pv6w in Wrangler's
tooling. Revisit it with Wrangler updates rather than downgrading Wrangler blindly.

The output in `dist/` is static. There is no R server, database, or API key.
The build regenerates `public/THIRD_PARTY_NOTICES.txt` from installed browser
dependencies and copies it into `dist/`. Keep this notice with distributed builds;
review webR's embedded dependencies when upgrading the pinned runtime.
`wrangler.jsonc` contains the current deployment target; use your own account
and domain for a fork. GitHub Actions performs validation only and never deploys.

The current Worker uses Cloudflare's native Git connection to this repository's
`main` branch, with repository root `/` and preview builds disabled. Its build
command is `bash scripts/cloudflare-build.sh`. It installs locked dependencies,
checks code and repeatable output, prepares headless Chromium, and runs browser
tests and local production smoke. Workers Builds has no root access, so the script
extracts Chromium's Ubuntu 24.04 libraries into `/tmp/mis130-browser-libs` and uses
`LD_LIBRARY_PATH`. No library binaries are committed or copied into `dist/`.
Failed build/test commands prevent deployment.
`SKIP_DEPENDENCY_INSTALL=1` makes the explicit locked installation authoritative;
the pinned Node version comes from `.nvmrc`.

The deploy command publishes the existing `dist/` with Wrangler, retries the live
SHA-256 comparison up to five times for propagation, and runs the real-R live
smoke using the same temporary Chromium library path. A post-deployment failure
is reported as a failed build; it does not
automatically roll back an already published Worker version. Build commands and
the existing managed API token are configured in Worker Settings → Builds.
Do not enable a second automatic deployment workflow for the same Worker.

See [content rights](CONTENT_RIGHTS.md) for attribution and dependency licences,
and [validation](VALIDATION.md) for what has actually been verified.

## Independent deployment verification

Check out the full commit associated with the intended release into a clean
directory, select the exact Node.js version from `.nvmrc`, and run:

```sh
npm ci
npm run build
npm run verify:deployment -- https://mis130.site
```

The verifier computes SHA-256 directly from the rebuilt `dist/` files and fetches
each corresponding site URL. It checks the root HTML, privacy page, JS/CSS,
favicon, original source materials, software notices, and the generated
`build-manifest.json` itself. It never uses the remote manifest to decide which
files or hashes to trust. Changed bytes, missing files, off-site/excessive redirects,
and failed requests cause a nonzero exit status. Same-origin canonical redirects
(such as `privacy.html` → `privacy`) are followed, then the returned bytes are
checked. HTTP compression is decoded before hashing.
The same command accepts a local preview or another deployment's base URL.

`npm run check:reproducible` builds twice and compares every output file. CI runs
this check and stores the tested `dist/` as the `site-build` artifact for 30 days.
The manifest has no timestamps or machine paths; dependency versions come from
the lockfile. `npm run test:verification` exercises matching, altered, missing,
and redirected responses, including canonical HTML URLs, off-site redirects,
redirect loops, and an altered manifest. A local production
smoke also verifies the entire served build before running browser checks.

Matching output independently links the checked-out source to the static files
returned during that verification. A footer version or a remote checksum alone
does not establish this. Differences in toolchains or hosting HTML rewriting may
cause a mismatch; do not interpret it as proof of malicious changes. Verify the
exact release commit and toolchain before investigating the differing files.
External webR binaries, fonts, linked third-party resources, response headers,
and responses to other visitors or at a later time are outside this comparison.
