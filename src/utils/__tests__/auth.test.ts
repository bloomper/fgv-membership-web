import { describe, expect, it } from "vitest";
import {
  appendLogoutParams,
  extractRolesFromClaims,
  hasAccess,
  isAdmin,
  isBoard,
  isTreasurer,
  normalizeTheme,
} from "@/utils/auth";

describe("extractRolesFromClaims", () => {
  it("reads the fgv-membership client roles only, with the roles below the highest", () => {
    expect(
      extractRolesFromClaims({
        resource_access: {
          "fgv-membership": { roles: ["TREASURER", "SYNC"] },
          "fgv-spexregister": { roles: ["ADMIN"] },
        },
      })
    ).toEqual(["USER", "BOARD", "TREASURER"]);
    expect(extractRolesFromClaims({ resource_access: { "fgv-membership": { roles: ["ADMIN"] } } })).toEqual([
      "USER",
      "BOARD",
      "TREASURER",
      "ADMIN",
    ]);
  });

  it("ignores roles that are not people's, and gives none without the claim", () => {
    expect(extractRolesFromClaims({ resource_access: { "fgv-membership": { roles: ["SYNC", "PAYMENT"] } } })).toEqual(
      []
    );
    expect(extractRolesFromClaims({})).toEqual([]);
    expect(extractRolesFromClaims({ resource_access: { "fgv-spexregister": { roles: ["USER"] } } })).toEqual([]);
  });
});

describe("role helpers", () => {
  it("tells the roles apart", () => {
    expect(hasAccess(["USER"])).toBe(true);
    expect(hasAccess([])).toBe(false);
    expect(isBoard(["USER"])).toBe(false);
    expect(isBoard(["USER", "BOARD"])).toBe(true);
    expect(isTreasurer(["USER", "BOARD"])).toBe(false);
    expect(isTreasurer(["USER", "BOARD", "TREASURER"])).toBe(true);
    expect(isAdmin(["USER", "BOARD", "TREASURER", "ADMIN"])).toBe(true);
  });
});

describe("normalizeTheme", () => {
  it("accepts known themes only", () => {
    expect(normalizeTheme("dark")).toBe("dark");
    expect(normalizeTheme("light")).toBe("light");
    expect(normalizeTheme("system")).toBe("system");
    expect(normalizeTheme("neon")).toBeUndefined();
    expect(normalizeTheme(undefined)).toBeUndefined();
  });
});

describe("appendLogoutParams", () => {
  const endSession = "https://kc.example/realms/r/protocol/openid-connect/logout";

  it("returns the URL untouched when there is nothing to append", () => {
    expect(appendLogoutParams(endSession)).toBe(endSession);
  });

  it("appends locale and theme", () => {
    const url = new URL(appendLogoutParams(endSession, "sv", "dark"));

    expect(url.searchParams.get("ui_locales")).toBe("sv");
    expect(url.searchParams.get("theme")).toBe("dark");
  });

  it("preserves the params Better Auth already put on the URL", () => {
    const withHint = `${endSession}?id_token_hint=abc&post_logout_redirect_uri=https%3A%2F%2Fapp.example`;

    const url = new URL(appendLogoutParams(withHint, "en"));

    expect(url.searchParams.get("id_token_hint")).toBe("abc");
    expect(url.searchParams.get("post_logout_redirect_uri")).toBe("https://app.example");
    expect(url.searchParams.get("ui_locales")).toBe("en");
    expect(url.searchParams.get("theme")).toBeNull();
  });
});
