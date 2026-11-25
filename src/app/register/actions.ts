"use server";

import { headers } from "next/headers";
import { cookies } from "next/headers";

export type RegisterState = { status: "idle" } | { status: "sent" } | { status: "error"; error: "challenge" | "rate" | "invalid" | "unavailable" };

const endpoint = () => process.env.API_REGISTRATION_ENDPOINT ?? "http://localhost:8087/api/registration";

export async function register(_previous: RegisterState, form: FormData): Promise<RegisterState> {
  const text = (name: string) => String(form.get(name) ?? "").trim();
  const requestHeaders = await headers();
  const language = (await cookies()).get("locale")?.value === "en" ? "en" : "sv";
  const forwarded = requestHeaders.get("x-forwarded-for")?.split(",")[0]?.trim();

  try {
    const response = await fetch(endpoint(), {
      method: "POST",
      headers: { "Content-Type": "application/json", ...(forwarded ? { "X-Forwarded-For": forwarded } : {}) },
      body: JSON.stringify({
        firstName: text("firstName"),
        lastName: text("lastName"),
        email: text("email"),
        message: text("message"),
        language,
        turnstileToken: text("cf-turnstile-response"),
      }),
      cache: "no-store",
    });

    if (response.status === 202) {
      return { status: "sent" };
    }
    if (response.status === 429) {
      return { status: "error", error: "rate" };
    }
    if (response.status === 400) {
      const body = (await response.json().catch(() => ({}))) as { error?: string };

      return { status: "error", error: body.error === "challenge-failed" ? "challenge" : "invalid" };
    }
    return { status: "error", error: "unavailable" };
  } catch {
    return { status: "error", error: "unavailable" };
  }
}

export async function verify(_previous: { status: "idle" | "ok" | "invalid" }, form: FormData): Promise<{ status: "idle" | "ok" | "invalid" }> {
  const response = await fetch(`${endpoint()}/verify`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token: String(form.get("token") ?? "") }),
    cache: "no-store",
  }).catch(() => undefined);

  return { status: response?.ok ? "ok" : "invalid" };
}
