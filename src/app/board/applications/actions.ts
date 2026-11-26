"use server";

import { revalidatePath } from "next/cache";
import { graphql, GraphQLRequestError } from "@/lib/graphql";
import { adminMutations } from "@/lib/payment";
import { requireRole } from "@/lib/guard";

export type AppState = { ok: boolean; message?: string } | null;

function failure(error: unknown): AppState {
  return { ok: false, message: error instanceof GraphQLRequestError ? error.message : "Error" };
}

/** Accepts with the spexare the board picked, or, when none is picked, with one created from the account. */
export async function accept(id: string, _state: AppState, form: FormData): Promise<AppState> {
  const viewer = await requireRole("BOARD", "/board/applications");

  try {
    await graphql(viewer.accessToken, adminMutations.acceptApplication, { id, spexareId: String(form.get("spexare") ?? "") || null });
  } catch (error) {
    return failure(error);
  }
  revalidatePath("/board/applications");
  return { ok: true };
}

export async function reject(id: string, _state: AppState, form: FormData): Promise<AppState> {
  const viewer = await requireRole("BOARD", "/board/applications");

  try {
    await graphql(viewer.accessToken, adminMutations.rejectApplication, { id, message: String(form.get("message") ?? "") || null });
  } catch (error) {
    return failure(error);
  }
  revalidatePath("/board/applications");
  return { ok: true };
}
