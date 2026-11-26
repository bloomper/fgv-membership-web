"use server";

import { revalidatePath } from "next/cache";
import { graphql, GraphQLRequestError } from "@/lib/graphql";
import { paymentMutations } from "@/lib/payment";
import { requireRole } from "@/lib/guard";

export type TreasurerState = { ok: boolean; message?: string } | null;

async function run(query: string, variables: Record<string, unknown>): Promise<TreasurerState> {
  const viewer = await requireRole("TREASURER", "/treasurer/payments");

  try {
    await graphql(viewer.accessToken, query, variables);
  } catch (error) {
    return { ok: false, message: error instanceof GraphQLRequestError ? error.message : "Error" };
  }
  revalidatePath("/treasurer/payments");
  return { ok: true };
}

export async function recordPayment(requestId: string, _state: TreasurerState, form: FormData): Promise<TreasurerState> {
  return run(paymentMutations.recordPayment, {
    requestId,
    paidOn: String(form.get("paidOn") ?? ""),
    amount: Number(form.get("amount")),
    how: String(form.get("how") ?? "SWISH"),
    note: String(form.get("note") ?? "") || null,
  });
}

export async function cancelRequest(requestId: string): Promise<TreasurerState> {
  return run(paymentMutations.cancelPaymentRequest, { id: requestId });
}
