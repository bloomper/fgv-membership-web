/** Medlemskap's roles, lowest first. Each role includes the ones before it. */
export const ROLES = ["USER", "BOARD", "TREASURER", "ADMIN"] as const;
export type Role = (typeof ROLES)[number];

export type AuthzFail = { ok: false; status: 401 | 403; message: string };
export type AuthzOk = { ok: true; roles: Role[] };
export type AuthzResult = AuthzOk | AuthzFail;

export type AccessTokenClaims = {
  resource_access?: {
    [resource: string]:
      | {
          roles?: string[];
        }
      | undefined;
  };
};
