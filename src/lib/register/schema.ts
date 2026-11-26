import {z} from "zod";

export const MAX_NAME = 255;
export const MAX_REGISTRATION_MESSAGE = 500;

export const registerSchema = z.object({
    firstName: z.string().trim().min(1, "required").max(MAX_NAME, "tooLong"),
    lastName: z.string().trim().min(1, "required").max(MAX_NAME, "tooLong"),
    email: z.email("emailInvalid").max(MAX_NAME, "tooLong"),
    message: z.string().trim().max(MAX_REGISTRATION_MESSAGE, "tooLong"),
});

export type RegisterValues = z.infer<typeof registerSchema>;
