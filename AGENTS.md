<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read
the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next`
package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at
`node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted
change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Medlemskap Web — project notes

Next.js 16 App Router + React 19 frontend for Medlemskap, FGV's application for memberships and membership fees, and
for the user accounts of FGV's applications. It is backed by `fgv-membership-server`'s GraphQL API. Stack and setup:
`README.md`. PR process: `CONTRIBUTING.md`. The product spec is in the `fgv-membership-spec` repository.

The stack and the configuration are the same as in FGV's other webs (Nyuppsättning, Spexregister, Spexipedia, ...):
shadcn/ui on Base UI, urql with generated GraphQL documents, react-hook-form with Zod, next-intl, Better Auth with
Keycloak, Tailwind 4, the React Compiler and Cache Components. When something here is unclear, look at how
`fgv-revival-web` does it.

## Commands

- `npm run dev` / `build` / `start` (dev on port 3007)
- `npm run lint` (ESLint), `npm run typecheck` (tsc) — typecheck only covers `src/**`, so `next.config.ts`,
  `codegen.ts` and `eslint.config.mts` are _not_ type-checked by it.
- `npm run test` (Vitest), `npm run test:e2e` (Playwright: a desktop and a phone-sized Chromium)
- `npm run gql-codegen` — regenerate `src/gql/` from the server's schema files in a sibling `fgv-membership-server`
  checkout (introspection is off). Commit the result: CI never regenerates it.

CI (`.github/workflows/build.yml`): lint → typecheck → test:coverage → build, then E2E as a separate job. Node version
comes from `.nvmrc`.

**Don't run `npm run format`.** `.prettierrc` sets `tabWidth: 2`, the codebase is 4-space indented, and
`.prettierignore` doesn't exclude `src/` — it would reformat the whole tree. ESLint enforces double quotes.

## File conventions

- **A module's directive and its filename must agree**, both ways:
  - `"use client"` ⇔ `*.client.ts(x)` — components _and_ hooks.
  - `import "server-only"` ⇔ `*.server.ts` (libs, utils).
  - `"use server"` ⇔ `*.server.ts` too — the `actions.server.ts` server-action modules. Don't add `server-only` to a
    `"use server"` file.
- Standing exceptions: `src/auth.ts` and Next.js reserved filenames (`page.tsx`, `layout.tsx`, `error.tsx`, ...).
- `src/gql/**` (generated) is ESLint-ignored — don't hand-edit it.

## Structure

- `src/app/(app)/` — the pages that need a login, with the sidebar. `(app)/layout.tsx` shows a start page for visitors
  and redirects someone without a role on Medlemskap to `/no-access`. Sections: `/membership` (a person's own
  membership and paying), `/board/*`, `/treasurer/*` and `/admin/*`.
- `src/app/(public)/` — the pages anyone can open, with a header only: `/register`, `/register/verify` and
  `/pay/[token]` (a personal payment link: the token in the address is the credential, and the API is called without
  a token).
- `src/utils/navigation.ts` — the menu, once, for the sidebar, the command palette and the start page.
- `src/lib/<area>/<area>.server.ts` — GraphQL documents and calls; `schema.ts` — the Zod schema of the area's forms.
- `src/components/<area>/*.client.tsx` — the forms and tables of an area; the shadcn components come from
  `@bloomper/fgv-web-ui/ui/*`.

## Shared FGV UI

The theme, the shadcn components and the application shell come from `@bloomper/fgv-web-ui` (repo
`bloomper/fgv-web-ui`, published to GitHub Packages), shared by all eight FGV web applications:

- `@bloomper/fgv-web-ui/ui/<name>` for every shadcn component (`button`, `sidebar`, `dialog`, …). Don't add a local
  copy with `shadcn add`: the shell and the application must share one `SidebarProvider`, and a change that belongs in
  every application goes into the package.
- `shell/*`: `SiteHeader` (wrapped in `src/components/site-header.client.tsx` with Medlemskap's own controls),
  `AppSwitcher`, `resolveApplications`, `SidebarBrand`, `NavMain`, `NavSecondary`, the toggles, `DataEmpty`, the
  status pages and the logos.
- **Pages** are a `Page` (`variant="content"` for articles and records, the default for lists and forms) with a
  `PageHeader` first (`title`, `description`, `actions`, `eyebrow`, `badges`), both from `shell/page-header`; a page's
  `loading.tsx` uses the same `Page`.
- **Confirmations** always ask in an alert dialog: `ConfirmButton` (`shell/confirm-button`), or
  `useDialogs().confirm` / `prompt` / `choose` (`shell/dialogs`; mount `DialogsProvider` in the `(app)` layout first)
  inside a handler. A dialog with content of its own uses `ui/alert-dialog` directly. Never `window.confirm` or
  `window.prompt`.
- `src/app/globals.css` imports `tailwindcss` and the package's `styles.css`, then only what is Medlemskap's own. The brand
  colour on the page background (links, labels, active icons) is `text-link`; `primary` is for fills.
- The favicons in `src/app/` (`icon.svg`, `favicon.ico`, `apple-icon.png`) are Medlemskap's switcher icon on the brand
  blue, generated in the package (`scripts/app-icons.mjs`).
- The shell's texts live in the package under `FgvUi`; `withFgvMessages` adds them wherever messages are loaded
  (`src/i18n/request.ts`, `src/app/layout.tsx`, `changeLocale` in `src/app/provider.client.tsx`), and
  `FgvShellProvider` there hands the shell `changeLocale` and Umami's `track`.
- Installing needs a token, even locally: `.npmrc` reads `NODE_AUTH_TOKEN` (a token with `read:packages`). CI uses
  `GITHUB_TOKEN`, and the image build gets it as the `npm_token` build secret.
- Vitest inlines the package (`server.deps.inline`) so the mocks in the setup file reach it.

## Rendering and caching — Cache Components is ON

- `(app)/layout.tsx` carries `export const instant = false`; `(app)/loading.tsx` is the Suspense fallback of every page
  beneath it.
- The root layout's metadata must stay a **static** `export const metadata`; the locale-correct title is applied
  client-side in `src/app/provider.client.tsx`.
- `"use cache"` cannot wrap anything reading cookies/headers.

## i18n

- Locale is a **cookie**, not a URL segment. `src/i18n/request.ts` reads it; `normalizeLocale()` validates it against
  `SUPPORTED_LOCALES` / `DEFAULT_LOCALE` (default `sv`).
- Messages: `messages/{sv,en}.json`, a namespace for each area (`Members`, `Treasurer`, ...). `src/__tests__/messages.test.ts`
  checks that both languages have the same keys and that every key the source translates exists.

## Auth and authorization

- **Better Auth** + Keycloak, configured in `src/auth.ts`; stateless (the session and the tokens live in encrypted
  cookies). `getSessionContext()` in `src/utils/auth.server.ts` is the single entry point for server-side auth; the
  roles come from `resource_access["fgv-membership"].roles` in the access token.
- Medlemskap's roles are a ladder, `USER < BOARD < TREASURER < ADMIN`, and each includes the ones below it
  (`extractRolesFromClaims` in `src/utils/auth.ts`). Service roles (`SYNC`, `PAYMENT`, ...) are never people's.
- `src/proxy.ts` refreshes the account cookie before a page renders, and gives every page its Content Security Policy
  (`src/utils/csp.ts`, which allows Cloudflare's Turnstile for registration and nothing else from outside).
- Gate server code with `Policies` (`src/utils/policy.server.ts`) and `withPolicyPage` / `withPolicyAction`
  (`src/utils/route.server.ts`). The pages only decide what to show: the API enforces every rule.
- **No `NEXT_PUBLIC_*` variables.** Read config on the server at request time (after `await connection()` or another
  request-time API) and pass it to client components as props.

## Data layer

- Server-side GraphQL goes through `runQuery` / `runMutation` in `src/lib/graphql.server.ts`; the urql client
  (`src/lib/urql.server.ts`) injects the access token. Server actions return `ActionResult` (`toActionResult`), which
  `useActionFeedback` shows as a toast.
- The API's plain HTTP endpoints (Excel exports, registration, personal links) are called with `apiFetch` /
  `apiFetchPublic` (`src/lib/api.server.ts`); their address is derived from `API_GRAPHQL_ENDPOINT`, so no other
  variable is needed.
- Errors carry `extensions.classification`: `UNAUTHORIZED`, `FORBIDDEN`, `NOT_FOUND`, `BAD_REQUEST` (the message says
  why), `CONFLICT`, `SPEXREGISTER_UNAVAILABLE` and `DIRECTORY_UNAVAILABLE`.
- Amounts are whole kronor, as numbers: show them with `formatAmount`. Dates are `yyyy-mm-dd` and times
  `yyyy-mm-dd hh:mm`, in both languages: `formatDate` / `formatInstant` (`src/utils/format.ts`), and `DateInput` for
  fields.

## Tables and forms

Forms use `react-hook-form` + `zodResolver`; Zod messages are keys under `Validation`, translated where they are shown
(`FormError`). Lists use `DataTable` (client-side sorting and paging) where the data is all there, and plain `Table`
with page links where the server pages (users, the audit log). Anything that cannot be undone asks first with
`ConfirmButton` (`@bloomper/fgv-web-ui/shell/confirm-button`). `@tanstack/react-table` has the same traps under the React Compiler as in the other webs: never put
`table` in an effect's dependencies, and pass primitives to memoized cells.

## Mobile

The pages must work on a phone: the sidebar becomes a sheet behind the menu button, tables scroll sideways inside
their own box, and the controls are the shadcn ones, which are at least 36 px high. `e2e/mobile.spec.ts` (Pixel 7)
checks that no page is wider than the screen.

## Consent and visitor statistics

The cookie banner is c15t in offline mode with only the `necessary` category. Umami is reached server-side at
`UMAMI_URL`; browsers never talk to it (`src/app/stats/`). Custom events go through `track()` (`src/utils/umami.ts`)
and carry enum values, counts and booleans only, never names, emails, ids or typed text.

## Application switcher

The title in the header (`AppSwitcher` from `@bloomper/fgv-web-ui/shell/app-switcher`) opens a menu of the FGV
applications the user can open (`getApplications()`), in the same order in every application; the addresses come from
`*_WEB_URL` variables. The list, the component and their tests live in the package; each application only passes its
own id in `applications.server.ts`.

## Testing

- Unit: Vitest, tests in `__tests__/` beside the code.
- E2E: Playwright against a real `next build && next start` on port 3107, with `e2e/mock-backend.mjs` standing in for
  the API on 4107. The same mock also acts as a mini-Keycloak, and `e2e/auth.setup.ts` signs in through a real OIDC
  round-trip before saving `storageState`.
- All test data is fictitious.

## Dependency notes

- `graphql` is on 17.x; `@0no-co/graphql.web` must stay **≥ 1.3.4**.
- TypeScript runs **side by side**: `typescript` is aliased to `@typescript/typescript6` (typescript-eslint needs its
  JS API) and `@typescript/native` is TS 7, which owns the `tsc` bin. `next build` resolves `typescript` and checks
  with `tsc6`.
