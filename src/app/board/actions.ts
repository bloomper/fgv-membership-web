"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { graphql, GraphQLRequestError } from "@/lib/graphql";
import { boardMutations } from "@/lib/board";
import { requireRole } from "@/lib/guard";

export type BoardState = { ok: boolean; message?: string; info?: string } | null;

function failure(error: unknown): BoardState {
  return { ok: false, message: error instanceof GraphQLRequestError ? error.message : "Error" };
}

export async function sendRenewals(year: number, _state: BoardState, form: FormData): Promise<BoardState> {
  const viewer = await requireRole("BOARD", "/board/renewals");

  try {
    const data = await graphql<{ sendRenewals: { sent: number; skipped: number } }>(viewer.accessToken, boardMutations.sendRenewals,
      { year, fee: String(form.get("fee") ?? "") });

    return { ok: true, info: `${data.sendRenewals.sent}/${data.sendRenewals.skipped}` };
  } catch (error) {
    return failure(error);
  }
}

export async function grantWaiver(spexareId: string, _state: BoardState, form: FormData): Promise<BoardState> {
  const viewer = await requireRole("BOARD", `/board/members/${spexareId}`);

  try {
    await graphql(viewer.accessToken, boardMutations.grantWaiver, {
      spexareId, year: Number(form.get("year")), lifetime: form.get("lifetime") === "on", note: String(form.get("note") ?? ""),
    });
  } catch (error) {
    return failure(error);
  }
  revalidatePath(`/board/members/${spexareId}`);
  return { ok: true };
}

export async function recordWithoutRequest(spexareId: string, _state: BoardState, form: FormData): Promise<BoardState> {
  const viewer = await requireRole("TREASURER", `/board/members/${spexareId}`);

  try {
    await graphql(viewer.accessToken, boardMutations.recordPaymentWithoutRequest, {
      spexareId, fees: form.getAll("fee").map(String), paidOn: String(form.get("paidOn") ?? ""), amount: Number(form.get("amount")),
      how: String(form.get("how") ?? "SWISH"), note: String(form.get("note") ?? "") || null,
    });
  } catch (error) {
    return failure(error);
  }
  revalidatePath(`/board/members/${spexareId}`);
  return { ok: true };
}

export async function sendLink(spexareId: string, _state: BoardState, form: FormData): Promise<BoardState> {
  const viewer = await requireRole("BOARD", `/board/members/${spexareId}`);

  try {
    const data = await graphql<{ sendPaymentLink: boolean }>(viewer.accessToken, boardMutations.sendPaymentLink, { spexareId, fees: form.getAll("fee").map(String) });

    revalidatePath(`/board/members/${spexareId}`);
    return { ok: true, info: data.sendPaymentLink ? "sent" : "not-sent" };
  } catch (error) {
    return failure(error);
  }
}

/** Search form: goes to the first match's page when there is one. */
export async function openMember(id: string) {
  redirect(`/board/members/${id}`);
}
