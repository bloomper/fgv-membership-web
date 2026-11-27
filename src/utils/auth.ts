import { AccessTokenClaims, type Role, ROLES } from "@/types/auth";

export const CLIENT_ID = "fgv-membership";

/**
 * Set for a minute when the app has asked Keycloak whether the user is already logged in to another FGV application.
 */
export const SSO_CHECKED_COOKIE = "sso_checked";

export const hasAccess = (roles: readonly Role[]) => roles.includes("USER");
export const isBoard = (roles: readonly Role[]) => roles.includes("BOARD");
export const isTreasurer = (roles: readonly Role[]) => roles.includes("TREASURER");
export const isAdmin = (roles: readonly Role[]) => roles.includes("ADMIN");

/**
 * The roles in the access token on `fgv-membership`, with the roles they include: the highest role held and every
 * one below it. Roles that are not people's, such as the service roles, are ignored.
 */
export function extractRolesFromClaims(claims: AccessTokenClaims): Role[] {
  const held = claims.resource_access?.[CLIENT_ID]?.roles ?? [];
  const top = Math.max(...ROLES.map((role, index) => (held.includes(role) ? index : -1)));

  return ROLES.slice(0, top + 1);
}

export const appendLogoutParams = (logoutUrl: string, locale?: string, theme?: "light" | "dark" | "system"): string => {
  if (!locale && !theme) {
    return logoutUrl;
  }

  const separator = logoutUrl.includes("?") ? "&" : "?";
  const urlParams = new URLSearchParams();

  if (locale) {
    urlParams.append("ui_locales", locale);
  }
  if (theme) {
    urlParams.append("theme", theme);
  }

  return `${logoutUrl}${separator}${urlParams.toString()}`;
};

export function normalizeTheme(value?: string): "light" | "dark" | "system" | undefined {
  if (value === "light" || value === "dark" || value === "system") return value;
  return undefined;
}
