import {z} from "zod";

export const MAX_APPLICATION_NAME = 200;
export const MAX_APPLICATION_TEXT = 1000;
export const MAX_FAMILY_NOTE = 500;
export const MAX_PAID_BY = 200;

export const applySchema = z.object({
    name: z.string().trim().min(1, "required").max(MAX_APPLICATION_NAME, "tooLong"),
    text: z.string().trim().min(1, "required").max(MAX_APPLICATION_TEXT, "tooLong"),
});

export type ApplyValues = z.infer<typeof applySchema>;

/** The fees ticked: one for each year, or the life fee. */
export const payRequestSchema = z.object({
    feeLevelIds: z.array(z.string().min(1)).min(1, "feeRequired"),
    familyNote: z.string().trim().max(MAX_FAMILY_NOTE, "tooLong"),
});

export type PayRequestValues = z.infer<typeof payRequestSchema>;

export const reportPaidSchema = z.object({
    paidBy: z.string().trim().max(MAX_PAID_BY, "tooLong"),
});

export type ReportPaidValues = z.infer<typeof reportPaidSchema>;
