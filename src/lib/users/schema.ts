import { z } from "zod";

export const MAX_REJECT_MESSAGE = 500;

/** The highest role on an application; empty takes all access away. */
export const accessSchema = z.object({
  clientId: z.string().min(1),
  role: z.string(),
  notify: z.boolean(),
});

export type AccessValues = z.infer<typeof accessSchema>;

export const rejectSchema = z.object({
  message: z.string().trim().max(MAX_REJECT_MESSAGE, "messageTooLong"),
  notify: z.boolean(),
});

export type RejectValues = z.infer<typeof rejectSchema>;

export const userActionSchema = z.enum([
  "activate",
  "deactivate",
  "resendVerification",
  "setPassword",
  "resetPassword",
]);

export type UserAction = z.infer<typeof userActionSchema>;
