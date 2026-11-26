"use server";

import { revalidatePath } from "next/cache";
import { personalLinkEndpoint } from "@/lib/board";

export type LinkState = { ok: boolean } | null;

export async function report(token: string, _state: LinkState, form: FormData): Promise<LinkState> {
  const response = await fetch(`${personalLinkEndpoint()}/${encodeURIComponent(token)}/report`, {
    method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ paidBy: String(form.get("paidBy") ?? "") || null }), cache: "no-store",
  });

  revalidatePath(`/pay/${token}`);
  return { ok: response.ok };
}

export async function optOut(token: string): Promise<LinkState> {
  const response = await fetch(`${personalLinkEndpoint()}/${encodeURIComponent(token)}/opt-out`, { method: "POST", cache: "no-store" });

  revalidatePath(`/pay/${token}`);
  return { ok: response.ok };
}
