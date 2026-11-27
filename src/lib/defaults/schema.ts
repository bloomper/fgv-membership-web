import { z } from "zod";

export const defaultAccessSchema = z.object({
  profile: z.enum(["MEMBER", "SUPPORT"]),
  clientId: z.string().min(1),
  role: z.string(),
});

export type DefaultAccessValues = z.infer<typeof defaultAccessSchema>;
