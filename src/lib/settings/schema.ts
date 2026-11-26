import {z} from "zod";
import type {SettingsInput} from "@/gql/graphql";

export const settingsSchema = z.object({
    swishNumber: z.string().trim().max(50, "tooLong"),
    bankgiro: z.string().trim().max(50, "tooLong"),
    bankAccount: z.string().trim().max(100, "tooLong"),
    payeeName: z.string().trim().max(100, "tooLong"),
    reminderDays: z.number().int().min(1, "daysInvalid").max(60, "daysInvalid"),
    recipients: z.string().trim().max(2000, "tooLong"),
});

export type SettingsValues = z.infer<typeof settingsSchema>;

/** An empty value falls back to the server's configuration. */
export function toSettingsInput(values: SettingsValues): SettingsInput {
    return {
        swishNumber: values.swishNumber || null,
        bankgiro: values.bankgiro || null,
        bankAccount: values.bankAccount || null,
        payeeName: values.payeeName || null,
        reminderDays: values.reminderDays,
        recipients: values.recipients || null,
    };
}
