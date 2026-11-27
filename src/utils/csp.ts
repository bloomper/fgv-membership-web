/**
 * The pages' Content Security Policy, set on every page by {@code proxy.ts}, as in FGV's other webs. Nothing on these
 * pages comes from another origin except Cloudflare's Turnstile widget on the registration page.
 */
export function contentSecurityPolicy(development: boolean): string {
  return [
    "default-src 'self'",
    `script-src 'self' 'unsafe-inline' https://challenges.cloudflare.com${development ? " 'unsafe-eval'" : ""}`,
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' blob: data: https:",
    "font-src 'self'",
    "connect-src 'self' https://challenges.cloudflare.com",
    "frame-src https://challenges.cloudflare.com",
    "worker-src 'self' blob:",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
  ].join("; ");
}
