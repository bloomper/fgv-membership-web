# fgv-membership-web

The web of Medlemskap, FGV's application for memberships and membership fees. The product spec is in
[`fgv-membership-spec`](../fgv-membership-spec/docs/product-spec.md); the API is
[`fgv-membership-server`](../fgv-membership-server).

Next.js 16 (App Router, Cache Components, the React Compiler), React 19, shadcn/ui on Base UI, Tailwind 4, urql with
generated GraphQL documents, react-hook-form with Zod, next-intl (Swedish and English), Better Auth with Keycloak. It has
the same stack and configuration as FGV's other webs; see `AGENTS.md` for the conventions.

## What is here

The accounts part of the spec (5.11 and 5.12) so far:

| Page                   | Who          | What                                                                                       |
|------------------------|--------------|--------------------------------------------------------------------------------------------|
| `/register`            | Everyone     | Creates an account: name, email, a message to the administrators and a Cloudflare Turnstile challenge. Keycloak's *Register* link points here |
| `/register/verify`     | Everyone     | The link in the verification email. It shows a button instead of acting on its own, so that mail scanners cannot use the token up |
| `/admin/users`         | `ADMIN`      | Search users, filter by status                                                             |
| `/admin/users/[id]`    | `ADMIN`      | Activate or deactivate, give or take away access to each FGV application and its roles, resend emails, reject a pending user |

## Running

```shell
# .env.local, which is not committed: AUTH_SECRET, KEYCLOAK_CLIENT_SECRET and, to differ from the defaults,
# KEYCLOAK_ISSUER, API_GRAPHQL_ENDPOINT and BETTER_AUTH_URL (see Configuration)
npm ci
npm run dev                  # http://localhost:3007
npm test
```

Keycloak and the API must be running; see `fgv-membership-deploy`.

## Configuration

| Variable                    | Purpose                                                              |
|-----------------------------|----------------------------------------------------------------------|
| `BETTER_AUTH_URL`           | This site's address                                                  |
| `AUTH_SECRET`               | At least 32 random characters                                        |
| `KEYCLOAK_ISSUER`, `KEYCLOAK_CLIENT_ID`, `KEYCLOAK_CLIENT_SECRET` | The `fgv-membership` client |
| `API_GRAPHQL_ENDPOINT`      | The API (locally `http://localhost:8090/api/graphql`); registration, personal links and the exports are on the same host |
| `TURNSTILE_SITE_KEY`        | The public key of the Turnstile widget. Cloudflare's `1x00000000000000000000AA` always passes |
| `SUPPORT_EMAIL`, `FEEDBACK_EMAIL`, `SUPPORTED_LOCALES`, `DEFAULT_LOCALE` | In `.env`, which is committed |
| `*_WEB_URL`                 | The other FGV applications, for the switcher in the header (optional) |
| `UMAMI_URL`, `UMAMI_WEBSITE_ID` | Visitor statistics (optional)                                    |

## License

Apache 2.0.
