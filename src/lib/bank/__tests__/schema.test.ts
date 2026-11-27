import { describe, expect, it } from "vitest";
import { bankFormatSchema, matchSchema, toBankFormatInput } from "@/lib/bank/schema";

const format = {
  name: "Swedbank",
  charset: "UTF-8",
  delimiter: ";",
  headerLines: 1,
  dateColumn: 1,
  amountColumn: 2,
  textColumn: 3,
  payerColumn: null,
  dateFormat: "yyyy-MM-dd",
  decimalComma: true,
};

describe("bankFormatSchema", () => {
  it("counts columns from 1 and wants a single separator character", () => {
    expect(bankFormatSchema.safeParse(format).success).toBe(true);
    expect(bankFormatSchema.safeParse({ ...format, dateColumn: 0 }).error?.issues[0].message).toBe("columnInvalid");
    expect(bankFormatSchema.safeParse({ ...format, delimiter: ";;" }).error?.issues[0].message).toBe(
      "delimiterInvalid"
    );
  });

  it("carries the id of the format that is changed", () => {
    expect(toBankFormatInput("1", format).id).toBe("1");
    expect(toBankFormatInput(null, format).id).toBeNull();
  });
});

describe("matchSchema", () => {
  it("needs at least one request", () => {
    expect(matchSchema.safeParse({ requestIds: [] }).error?.issues[0].message).toBe("requestRequired");
  });
});
