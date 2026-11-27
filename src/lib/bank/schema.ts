import { z } from "zod";
import type { BankFormatInput } from "@/gql/graphql";

const column = z.number().int().min(1, "columnInvalid");

/** How a bank's statement is laid out; columns are counted from 1. */
export const bankFormatSchema = z.object({
  name: z.string().trim().min(1, "required").max(100, "tooLong"),
  charset: z.string().trim().min(1, "required"),
  delimiter: z.string().length(1, "delimiterInvalid"),
  headerLines: z.number().int().min(0, "columnInvalid"),
  dateColumn: column,
  amountColumn: column,
  textColumn: column,
  payerColumn: z.number().int().min(1, "columnInvalid").nullable(),
  dateFormat: z.string().trim().min(1, "required"),
  decimalComma: z.boolean(),
});

export type BankFormatValues = z.infer<typeof bankFormatSchema>;

export function toBankFormatInput(id: string | null, values: BankFormatValues): BankFormatInput {
  return { id, ...values };
}

/** The requests a transaction was for: one, or several that it is split over. */
export const matchSchema = z.object({
  requestIds: z.array(z.string().min(1)).min(1, "requestRequired"),
});

export type MatchValues = z.infer<typeof matchSchema>;
