"use server";

import { revalidatePath } from "next/cache";
import { graphql, GraphQLRequestError } from "@/lib/graphql";
import { paymentMutations } from "@/lib/payment";
import { requireRole } from "@/lib/guard";

export type FeeState = { ok: boolean; message?: string } | null;

async function run(query: string, variables: Record<string, unknown>): Promise<FeeState> {
  const viewer = await requireRole("ADMIN", "/admin/fees");

  try {
    await graphql(viewer.accessToken, query, variables);
  } catch (error) {
    return { ok: false, message: error instanceof GraphQLRequestError ? error.message : "Error" };
  }
  revalidatePath("/admin/fees");
  return { ok: true };
}

export async function saveFee(id: string | null, _state: FeeState, form: FormData): Promise<FeeState> {
  const kind = String(form.get("kind") ?? "STANDARD");
  const year = String(form.get("year") ?? "");

  return run(paymentMutations.feeLevelSave, {
    input: {
      id,
      year: year ? Number(year) : null,
      kind,
      nameSv: String(form.get("nameSv") ?? ""),
      nameEn: String(form.get("nameEn") ?? ""),
      amount: Number(form.get("amount")),
    },
  });
}

export async function retireFee(id: string, retired: boolean): Promise<FeeState> {
  return run(paymentMutations.feeLevelRetire, { id, retired });
}
