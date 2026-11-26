import { describe, expect, it } from "vitest";
import { returnPath } from "./return-path";

describe("returnPath", () => {
  it("keeps a path on this site, with its query", () => {
    expect(returnPath("/admin/users?status=PENDING")).toBe("/admin/users?status=PENDING");
    expect(returnPath("/membership/pay/abc")).toBe("/membership/pay/abc");
  });

  it("sends anything that could leave the site to the front page", () => {
    for (const value of ["https://evil.example", "//evil.example", "/\\evil.example", "evil", "", null, undefined]) {
      expect(returnPath(value)).toBe("/");
    }
  });
});
