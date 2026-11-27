import { describe, expect, it } from "vitest";
import { familySchema, feesSchema, recordWithoutRequestSchema, waiverSchema } from "@/lib/members/schema";

const message = (result: { success: boolean; error?: { issues: { message: string }[] } }) =>
  result.error?.issues[0].message;

describe("waiverSchema", () => {
  it("needs a note and a plausible year", () => {
    expect(waiverSchema.safeParse({ year: 2026, lifetime: false, note: "Hedersmedlem" }).success).toBe(true);
    expect(message(waiverSchema.safeParse({ year: 2026, lifetime: false, note: " " }))).toBe("required");
    expect(message(waiverSchema.safeParse({ year: 1900, lifetime: false, note: "x" }))).toBe("yearInvalid");
  });
});

describe("feesSchema", () => {
  it("needs at least one fee", () => {
    expect(message(feesSchema.safeParse({ fees: [] }))).toBe("feeRequired");
    expect(feesSchema.safeParse({ fees: ["a"] }).success).toBe(true);
  });
});

describe("recordWithoutRequestSchema", () => {
  const valid = { fees: ["a"], paidOn: "2026-03-01", amount: 200, how: "SWISH", note: "" };

  it("takes a payment that arrived by a way the treasurer records", () => {
    expect(recordWithoutRequestSchema.safeParse(valid).success).toBe(true);
    expect(recordWithoutRequestSchema.safeParse({ ...valid, how: "ONLINE" }).success).toBe(false);
  });

  it("needs a date that exists and a positive whole amount", () => {
    expect(message(recordWithoutRequestSchema.safeParse({ ...valid, paidOn: "2026-02-31" }))).toBe("dateInvalid");
    expect(message(recordWithoutRequestSchema.safeParse({ ...valid, amount: 0 }))).toBe("amountInvalid");
    expect(recordWithoutRequestSchema.safeParse({ ...valid, amount: 1.5 }).success).toBe(false);
  });
});

describe("familySchema", () => {
  it("needs at least one person", () => {
    expect(message(familySchema.safeParse({ spexareIds: [] }))).toBe("personRequired");
  });
});
