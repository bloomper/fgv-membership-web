# fgv-membership-web

The web of Medlemskap, FGV's application for memberships and membership fees. The product spec is in
[`fgv-membership-spec`](../fgv-membership-spec/docs/product-spec.md); the API is
[`fgv-membership-server`](../fgv-membership-server).

Next.js 16 (App Router), React 19, next-intl (Swedish and English), Better Auth with Keycloak, Tailwind.

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
cp .env.example .env.local   # then fill in the Keycloak secret
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
| `API_GRAPHQL_ENDPOINT`, `API_REGISTRATION_ENDPOINT` | The API, from the server side of the web   |
| `TURNSTILE_SITE_KEY`        | The public key of the Turnstile widget. Cloudflare's `1x00000000000000000000AA` always passes |

## License

Apache 2.0.
