import "server-only";

import { betterAuth } from "better-auth";
import { genericOAuth, keycloak } from "better-auth/plugins/generic-oauth";
import { nextCookies } from "better-auth/next-js";

const appUrl = process.env.BETTER_AUTH_URL;
const issuer = (process.env.KEYCLOAK_ISSUER ?? "").replace(/\/$/, "");
const endpoint = (name: string) => `${issuer}/protocol/openid-connect/${name}`;

export const auth = betterAuth({
  baseURL: appUrl,
  secret: process.env.AUTH_SECRET,
  // The tokens stay on the server: pages read them with auth.api, and browser code has no use for them
  disabledPaths: ["/get-access-token", "/refresh-token", "/account-info"],
  plugins: [
    genericOAuth({
      config: [
        {
          ...keycloak({
            issuer,
            clientId: process.env.KEYCLOAK_CLIENT_ID ?? "",
            clientSecret: process.env.KEYCLOAK_CLIENT_SECRET ?? "",
            postLogoutRedirectURI: appUrl,
          }),
          authorizationUrl: endpoint("auth"),
          tokenUrl: endpoint("token"),
          userInfoUrl: endpoint("userinfo"),
          endSessionEndpoint: endpoint("logout"),
        },
      ],
    }),
    nextCookies(),
  ],
});
