"use server";

import { revalidatePath } from "next/cache";
import { graphql, GraphQLRequestError } from "@/lib/graphql";
import { adminMutations } from "@/lib/payment";
import { requireRole } from "@/lib/guard";

export type SettingsState = { ok: boolean; message?: string } | null;

export async function save(_state: SettingsState, form: FormData): Promise<SettingsState> {
  const viewer = await requireRole("ADMIN", "/admin/settings");

  try {
    await graphql(viewer.accessToken, adminMutations.saveSettings, {
      input: {
        swishNumber: String(form.get("swishNumber") ?? ""), bankAccount: String(form.get("bankAccount") ?? ""), payeeName: String(form.get("payeeName") ?? ""),
        reminderDays: Number(form.get("reminderDays")), recipients: String(form.get("recipients") ?? ""),
      },
    });
  } catch (error) {
    return { ok: false, message: error instanceof GraphQLRequestError ? error.message : "Error" };
  }
  revalidatePath("/admin/settings");
  return { ok: true };
}
