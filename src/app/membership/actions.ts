"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { graphql, GraphQLRequestError } from "@/lib/graphql";
import { paymentMutations } from "@/lib/payment";
import { getViewer } from "@/lib/session";

export type PayState = { ok: boolean; message?: string } | null;

async function token(): Promise<string> {
  const viewer = await getViewer();

  if (!viewer) {
    redirect("/api/auth/login?returnTo=/membership");
  }
  return viewer.accessToken;
}

/** Asks to pay the fees that were ticked, then shows how to pay. */
export async function startPayment(_state: PayState, form: FormData): Promise<PayState> {
  const feeLevelIds = form.getAll("fee").map(String);
  let id: string;

  try {
    id = (await graphql<{ requestPayment: { id: string } }>(await token(), paymentMutations.requestPayment, { feeLevelIds, familyNote: String(form.get("familyNote") ?? "") || null })).requestPayment.id;
  } catch (error) {
    return { ok: false, message: error instanceof GraphQLRequestError ? error.message : "Error" };
  }
  redirect(`/membership/pay/${id}`);
}

export async function reportPaid(id: string, _state: PayState, form: FormData): Promise<PayState> {
  try {
    await graphql(await token(), paymentMutations.reportPaid, { id, paidBy: String(form.get("paidBy") ?? "") || null });
  } catch (error) {
    return { ok: false, message: error instanceof GraphQLRequestError ? error.message : "Error" };
  }
  revalidatePath(`/membership/pay/${id}`);
  revalidatePath("/membership");
  return { ok: true };
}
