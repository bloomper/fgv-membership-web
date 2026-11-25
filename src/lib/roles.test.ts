import { describe, expect, it } from "vitest";
import { rolesOf } from "./roles";
import { returnPath } from "./return-path";

const token = (roles: string[]) => {
  const encode = (value: object) => Buffer.from(JSON.stringify(value)).toString("base64url");

  return `${encode({ alg: "none" })}.${encode({ resource_access: { "fgv-membership": { roles } } })}.x`;
};

describe("rolesOf", () => {
  it("includes the roles below the highest", () => {
    expect(rolesOf(token(["ADMIN"]))).toEqual(["USER", "BOARD", "TREASURER", "ADMIN"]);
    expect(rolesOf(token(["BOARD"]))).toEqual(["USER", "BOARD"]);
  });

  it("ignores roles that are not people's", () => {
    expect(rolesOf(token(["SYNC"]))).toEqual([]);
  });

  it("gives nothing without a token or with a broken one", () => {
    expect(rolesOf(undefined)).toEqual([]);
    expect(rolesOf("nonsense")).toEqual([]);
  });
});

describe("returnPath", () => {
  it("keeps paths on this site", () => {
    expect(returnPath("/admin/users")).toBe("/admin/users");
  });

  it("sends everything else to the front page", () => {
    expect(returnPath("https://evil.example")).toBe("/");
    expect(returnPath("//evil.example")).toBe("/");
    expect(returnPath("/\\evil.example")).toBe("/");
    expect(returnPath(null)).toBe("/");
  });
});
