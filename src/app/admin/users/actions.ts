"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { mutations } from "@/lib/admin";
import { graphql, GraphQLRequestError } from "@/lib/graphql";
import { getViewer } from "@/lib/session";
import { hasRole } from "@/lib/roles";

export type ActionState = { ok: boolean; message?: string } | null;

async function admin(): Promise<string> {
  const viewer = await getViewer();

  if (!viewer || !hasRole(viewer.roles, "ADMIN")) {
    redirect("/");
  }
  return viewer.accessToken;
}

async function run(userId: string, query: string, variables: Record<string, unknown>): Promise<ActionState> {
  const token = await admin();

  try {
    await graphql(token, query, variables);
  } catch (error) {
    // The server's messages say why, e.g. that the last administrator cannot be demoted
    return { ok: false, message: error instanceof GraphQLRequestError ? error.message : "Error" };
  }
  revalidatePath(`/admin/users/${userId}`);
  revalidatePath("/admin/users");
  return { ok: true };
}

export async function setEnabled(userId: string, enabled: boolean): Promise<ActionState> {
  return run(userId, mutations.setUserEnabled, { id: userId, enabled });
}

/** Each update says for itself whether the user is emailed: an unchecked box is not sent by the browser. */
function notifies(form: FormData): boolean {
  return form.get("notify") === "on";
}

/** An empty role takes away all access to the application. */
export async function setAccess(userId: string, _state: ActionState, form: FormData): Promise<ActionState> {
  const role = String(form.get("role") ?? "");

  return run(userId, mutations.setApplicationAccess, { userId, clientId: String(form.get("clientId")), role: role || null, notify: notifies(form) });
}

export async function reject(userId: string, _state: ActionState, form: FormData): Promise<ActionState> {
  const result = await run(userId, mutations.rejectUser, { id: userId, message: String(form.get("message") ?? "") || null, notify: notifies(form) });

  if (result?.ok) {
    redirect("/admin/users?status=PENDING");
  }
  return result;
}

export async function resendVerification(userId: string): Promise<ActionState> {
  return run(userId, mutations.resendVerification, { id: userId });
}

export async function sendSetPassword(userId: string): Promise<ActionState> {
  return run(userId, mutations.sendSetPasswordEmail, { id: userId });
}

export async function sendPasswordReset(userId: string): Promise<ActionState> {
  return run(userId, mutations.sendPasswordResetEmail, { id: userId });
}
