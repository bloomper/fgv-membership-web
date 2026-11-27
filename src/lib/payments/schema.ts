import { z } from "zod";
import { isoDate } from "@/lib/date-schema";
import { MAX_NOTE, RECORDED_HOWS } from "@/lib/members/schema";

export const recordPaymentSchema = z.object({
  paidOn: isoDate,
  amount: z.number().int().min(1, "amountInvalid"),
  how: z.enum(RECORDED_HOWS),
  note: z.string().trim().max(MAX_NOTE, "tooLong"),
});

export type RecordPaymentValues = z.infer<typeof recordPaymentSchema>;
