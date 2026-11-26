"use server";

import { revalidatePath } from "next/cache";
import { graphql, GraphQLRequestError } from "@/lib/graphql";
import { bankMutations } from "@/lib/payment";
import { requireRole } from "@/lib/guard";

export type FormatState = { ok: boolean; message?: string } | null;

async function run(query: string, variables: Record<string, unknown>): Promise<FormatState> {
  const viewer = await requireRole("ADMIN", "/admin/bank-formats");

  try {
    await graphql(viewer.accessToken, query, variables);
  } catch (error) {
    return { ok: false, message: error instanceof GraphQLRequestError ? error.message : "Error" };
  }
  revalidatePath("/admin/bank-formats");
  return { ok: true };
}

export async function saveFormat(id: string | null, _state: FormatState, form: FormData): Promise<FormatState> {
  const payer = String(form.get("payerColumn") ?? "");

  return run(bankMutations.bankFormatSave, {
    input: {
      id,
      name: String(form.get("name") ?? ""),
      charset: String(form.get("charset") ?? "UTF-8"),
      delimiter: String(form.get("delimiter") ?? ";"),
      headerLines: Number(form.get("headerLines")),
      dateColumn: Number(form.get("dateColumn")),
      amountColumn: Number(form.get("amountColumn")),
      textColumn: Number(form.get("textColumn")),
      payerColumn: payer ? Number(payer) : null,
      dateFormat: String(form.get("dateFormat") ?? "yyyy-MM-dd"),
      decimalComma: form.get("decimalComma") === "on",
    },
  });
}

export async function deleteFormat(id: string): Promise<FormatState> {
  return run(bankMutations.bankFormatDelete, { id });
}
