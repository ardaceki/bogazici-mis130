# Contributing

Start with the [development guide](docs/DEVELOPMENT.md). Keep changes focused on
the learning experience, correctness, accessibility, or maintainability.

Before submitting a change:

```sh
npm ci
npm run check
npm test
npm run test:production
```

Keep exercise IDs stable, cite the underlying course section, and verify answers
in real browser R. Add a regression test for a behavior change; do not add tests
that simply repeat implementation details. Do not commit generated builds,
test reports, credentials, or student data.

Describe the problem, resulting behavior, and relevant validation in a pull
request. Discuss significant scope changes before implementing them. Keep course
material attribution and third-party rights separate from the application
software licence; see [content rights](docs/CONTENT_RIGHTS.md).
