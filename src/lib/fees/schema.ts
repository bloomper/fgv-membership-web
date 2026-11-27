import { z } from "zod";
import type { FeeKind, FeeLevelInput } from "@/gql/graphql";

export const FEE_KINDS: FeeKind[] = ["STANDARD", "FAMILY", "LIFETIME", "SUPPORT"];

/** The year is left empty for a life fee that is offered from the start. */
export const feeSchema = z.object({
  kind: z.enum(["STANDARD", "FAMILY", "LIFETIME", "SUPPORT"]),
  year: z.number().int().min(1948, "yearInvalid").max(2200, "yearInvalid").nullable(),
  nameSv: z.string().trim().min(1, "required").max(100, "tooLong"),
  nameEn: z.string().trim().min(1, "required").max(100, "tooLong"),
  amount: z.number().int().min(0, "amountInvalid"),
});

export type FeeValues = z.infer<typeof feeSchema>;

export function toFeeLevelInput(id: string | null, values: FeeValues): FeeLevelInput {
  return { id, ...values };
}
