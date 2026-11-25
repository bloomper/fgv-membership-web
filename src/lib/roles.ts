import { jwtDecode } from "jwt-decode";

/** Medlemskap's roles, lowest first. Each role includes the ones before it. */
export const MEMBERSHIP_ROLES = ["USER", "BOARD", "TREASURER", "ADMIN"] as const;
export type MembershipRole = (typeof MEMBERSHIP_ROLES)[number];

export const CLIENT_ID = "fgv-membership";

type Claims = { resource_access?: Record<string, { roles?: string[] }> };

/** The roles in an access token on Medlemskap, with the roles they include. No token, no roles. */
export function rolesOf(accessToken: string | undefined | null): MembershipRole[] {
  if (!accessToken) {
    return [];
  }
  try {
    const held = jwtDecode<Claims>(accessToken).resource_access?.[CLIENT_ID]?.roles ?? [];
    const top = Math.max(...MEMBERSHIP_ROLES.map((role, index) => (held.includes(role) ? index : -1)));

    return MEMBERSHIP_ROLES.slice(0, top + 1);
  } catch {
    return [];
  }
}

export function hasRole(roles: readonly MembershipRole[], role: MembershipRole): boolean {
  return roles.includes(role);
}
