"use server";

import { revalidatePath } from "next/cache";
import { graphql, GraphQLRequestError } from "@/lib/graphql";
import { defaultAccessMutations } from "@/lib/payment";
import { requireRole } from "@/lib/guard";

export type DefaultsState = { ok: boolean; message?: string } | null;

/** An empty role means no access to the application. */
export async function saveDefault(profile: string, clientId: string, _state: DefaultsState, form: FormData): Promise<DefaultsState> {
  const viewer = await requireRole("ADMIN", "/admin/defaults");

  try {
    await graphql(viewer.accessToken, defaultAccessMutations.setDefaultAccess, { profile, clientId, role: String(form.get("role") ?? "") || null });
  } catch (error) {
    return { ok: false, message: error instanceof GraphQLRequestError ? error.message : "Error" };
  }
  revalidatePath("/admin/defaults");
  return { ok: true };
}
