import { z } from "zod";

export const MAX_DECISION_MESSAGE = 500;

/** The spexare the board picked; empty creates one from the account. */
export const acceptSchema = z.object({ spexareId: z.string() });

export type AcceptValues = z.infer<typeof acceptSchema>;

export const rejectApplicationSchema = z.object({
  message: z.string().trim().max(MAX_DECISION_MESSAGE, "tooLong"),
});

export type RejectApplicationValues = z.infer<typeof rejectApplicationSchema>;
