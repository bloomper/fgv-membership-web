"use server";

import { headers } from "next/headers";
import { cookies } from "next/headers";
import type { z } from "zod";
import { apiFetchPublic } from "@/lib/api.server";
import { registerSchema } from "@/lib/register/schema";

export type RegisterResult = "sent" | "challenge" | "rate" | "invalid" | "unavailable";

/**
 * Creates an account. The API checks the Turnstile answer and the rate limits, so the visitor's address is passed on:
 * without it every registration would count against this server.
 */
export async function registerAction(
  input: z.input<typeof registerSchema>,
  turnstileToken: string
): Promise<RegisterResult> {
  const values = registerSchema.safeParse(input);

  if (!values.success) {
    return "invalid";
  }

  const requestHeaders = await headers();
  const language = (await cookies()).get("locale")?.value === "en" ? "en" : "sv";
  const forwarded = requestHeaders.get("x-forwarded-for")?.split(",")[0]?.trim();

  try {
    const response = await apiFetchPublic("/api/registration", {
      method: "POST",
      headers: { "Content-Type": "application/json", ...(forwarded ? { "X-Forwarded-For": forwarded } : {}) },
      body: JSON.stringify({ ...values.data, language, turnstileToken }),
    });

    if (response.status === 202) {
      return "sent";
    }
    if (response.status === 429) {
      return "rate";
    }
    if (response.status === 400) {
      const body = (await response.json().catch(() => ({}))) as { error?: string };

      return body.error === "challenge-failed" ? "challenge" : "invalid";
    }
    return "unavailable";
  } catch {
    return "unavailable";
  }
}

/** Confirms the address with the token from the email. */
export async function verifyAction(token: string): Promise<boolean> {
  const response = await apiFetchPublic("/api/registration/verify", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token }),
  }).catch(() => undefined);

  return response?.ok ?? false;
}
