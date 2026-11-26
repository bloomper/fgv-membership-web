"use server";

import { revalidatePath } from "next/cache";
import { graphql, GraphQLRequestError } from "@/lib/graphql";
import { adminMutations } from "@/lib/payment";
import { requireRole } from "@/lib/guard";

export type ApplyState = { ok: boolean; message?: string } | null;

export async function apply(_state: ApplyState, form: FormData): Promise<ApplyState> {
  const viewer = await requireRole("USER", "/membership");

  try {
    await graphql(viewer.accessToken, adminMutations.applyForMembership, { name: String(form.get("name") ?? ""), text: String(form.get("text") ?? "") });
  } catch (error) {
    return { ok: false, message: error instanceof GraphQLRequestError ? error.message : "Error" };
  }
  revalidatePath("/membership");
  return { ok: true };
}
