import { z } from "zod";
import { isoDate } from "@/lib/date-schema";

export const MAX_NOTE = 500;
export const MEMBER_STATUSES = ["PAID", "WAIVED", "PENDING", "REPORTED", "CANCELLED"] as const;
export const MEMBER_HOWS = ["SWISH", "BANK_TRANSFER", "CASH", "ONLINE", "WAIVED", "REVIVAL", "MIGRATED"] as const;
/** How a treasurer or the board records that money arrived; the others are made by the system. */
export const RECORDED_HOWS = ["SWISH", "BANK_TRANSFER", "CASH"] as const;

const year = z.number().int().min(1948, "yearInvalid").max(2200, "yearInvalid");

export const waiverSchema = z.object({
  year,
  lifetime: z.boolean(),
  note: z.string().trim().min(1, "required").max(MAX_NOTE, "tooLong"),
});

export type WaiverValues = z.infer<typeof waiverSchema>;

export const feesSchema = z.object({
  fees: z.array(z.string().min(1)).min(1, "feeRequired"),
});

export type FeesValues = z.infer<typeof feesSchema>;

export const recordWithoutRequestSchema = feesSchema.extend({
  paidOn: isoDate,
  amount: z.number().int().min(1, "amountInvalid"),
  how: z.enum(RECORDED_HOWS),
  note: z.string().trim().max(MAX_NOTE, "tooLong"),
});

export type RecordWithoutRequestValues = z.infer<typeof recordWithoutRequestSchema>;

export const renewalSchema = z.object({ year, feeLevelId: z.string().min(1) });

export const familySchema = z.object({
  spexareIds: z.array(z.string().min(1)).min(1, "personRequired"),
});

export type FamilyValues = z.infer<typeof familySchema>;
