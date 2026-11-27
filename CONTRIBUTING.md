# Contributing to Medlemskap Web

Medlemskap Web is released under the Apache 2.0 license.
If you would like to contribute something, or simply want to work with the code, this document should help you to get
started.

## Code of conduct

This project adheres to the Contributor Covenant [code of conduct][1]. By participating, you are expected to uphold this
code.
Please report unacceptable behavior to [spexregistret@gmail.com](spexregistret@gmail.com).

## Code conventions and housekeeping

None of these is essential for a pull request, but they will all help.

- ESLint enforces **double quotes**. Run
  `npm run lint:fix` to correct what is auto-fixable.
- Whenever possible, please rebase your branch against the current develop (or other target branch in the project)
- When writing a commit message please follow [these conventions][2]
  Also, if you are fixing an existing issue please add `Fixes GH-nnn` at the end of the commit message (where nnn is the
  issue number)

## Working with the code

### Prerequisites

- Node.js — the required major version is in [`.nvmrc`](.nvmrc) (`nvm use` will pick it up)
- npm
- Docker & Docker Compose (optional, for the containerized setup)

A backend to talk to. `API_GRAPHQL_ENDPOINT` points at
[fgv-membership-server](https://github.com/bloomper/fgv-membership-server), and authentication
needs a Keycloak realm. Copy the auth and API settings into `.env.local` before starting.

### Building from source

```
$ npm ci
$ npm run build
```

Use `npm ci` rather than `npm install` so the lockfile is respected.

### Running locally

```
$ npm run dev
```

This serves the app on <http://localhost:3007>.

### Checks

Run these before opening a pull request — CI ([`.github/workflows/build.yml`](.github/workflows/build.yml))
runs them in this order and will fail the build on any of them:

```
$ npm run lint        # ESLint
$ npm run typecheck   # tsc, src/** only
$ npm run test        # Vitest unit tests (npm run test:coverage in CI)
$ npm run build       # next build
```

End-to-end tests (a desktop and a phone-sized browser) run as a separate CI job and need a browser installed once:

```
$ npx playwright install --with-deps chromium
$ npm run test:e2e
```

`npm run test:e2e` does a full `next build` and starts the app on port 3107 against a mock backend
on port 4107, so it needs no real backend or Keycloak — but it does mean a route you delete can
leave stale generated types behind. If a build fails with `Cannot find module '.../route.js'`
pointing into `.next/dev/types/`, remove `.next` and build again.

[1]: CODE_OF_CONDUCT.md
[2]: https://tbaggery.com/2008/04/19/a-note-about-git-commit-messages.html
