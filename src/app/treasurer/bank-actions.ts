"use server";

import { revalidatePath } from "next/cache";
import { graphql, GraphQLRequestError } from "@/lib/graphql";
import { bankFormats, bankMutations, type ImportResult } from "@/lib/payment";
import { requireRole } from "@/lib/guard";

export type BankState = { ok: boolean; message?: string; result?: ImportResult } | null;

function failure(error: unknown): BankState {
  return { ok: false, message: error instanceof GraphQLRequestError ? error.message : "Error" };
}

/** The file is decoded with the charset of the bank's format, which banks do not agree on. */
export async function importFile(_state: BankState, form: FormData): Promise<BankState> {
  const viewer = await requireRole("TREASURER", "/treasurer/import");
  const file = form.get("file");
  const formatId = String(form.get("formatId") ?? "");

  if (!(file instanceof File) || file.size === 0) {
    return { ok: false, message: "No file" };
  }
  try {
    const format = (await bankFormats(viewer.accessToken)).find((candidate) => candidate.id === formatId);

    if (!format) {
      return { ok: false, message: "Unknown format" };
    }

    const content = new TextDecoder(format.charset).decode(await file.arrayBuffer());
    const data = await graphql<{ importStatement: ImportResult }>(viewer.accessToken, bankMutations.importStatement, { formatId, fileName: file.name, content });

    revalidatePath("/treasurer/transactions");
    return { ok: data.importStatement.errors.length === 0, result: data.importStatement };
  } catch (error) {
    return failure(error);
  }
}

export async function matchTransaction(id: string, _state: BankState, form: FormData): Promise<BankState> {
  const viewer = await requireRole("TREASURER", "/treasurer/transactions");
  const requestIds = form.getAll("request").map(String);

  try {
    await graphql(viewer.accessToken, bankMutations.matchTransaction, { id, requestIds });
  } catch (error) {
    return failure(error);
  }
  revalidatePath("/treasurer/transactions");
  revalidatePath("/treasurer/payments");
  return { ok: true };
}

export async function dismissTransaction(id: string): Promise<BankState> {
  const viewer = await requireRole("TREASURER", "/treasurer/transactions");

  try {
    await graphql(viewer.accessToken, bankMutations.dismissTransaction, { id });
  } catch (error) {
    return failure(error);
  }
  revalidatePath("/treasurer/transactions");
  return { ok: true };
}

export async function undoPayment(id: string): Promise<BankState> {
  const viewer = await requireRole("TREASURER", "/treasurer/payments");

  try {
    await graphql(viewer.accessToken, bankMutations.undoPayment, { id });
  } catch (error) {
    return failure(error);
  }
  revalidatePath("/treasurer/payments");
  revalidatePath("/treasurer/transactions");
  return { ok: true };
}
