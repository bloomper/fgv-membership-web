"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { z } from "zod";
import { type ActionResult, toActionResult } from "@/lib/graphql.server";
import {
  rejectUser,
  resendVerification,
  sendPasswordResetEmail,
  sendSetPasswordEmail,
  setApplicationAccess,
  setUserEnabled,
} from "@/lib/users/users.server";
import { accessSchema, rejectSchema, type UserAction, userActionSchema } from "@/lib/users/schema";
import { Policies } from "@/utils/policy.server";
import { withPolicyAction } from "@/utils/route.server";

function refresh(userId: string) {
  revalidatePath(`/admin/users/${userId}`);
  revalidatePath("/admin/users");
}

/** An empty role takes away all access to the application. */
export async function setAccessAction(
  userId: string,
  input: z.input<typeof accessSchema>
): Promise<ActionResult<null>> {
  return withPolicyAction(Policies.admin.requireAdmin, () =>
    toActionResult(async () => {
      const values = accessSchema.parse(input);

      await setApplicationAccess(userId, values.clientId, values.role || null, values.notify);
      refresh(userId);
      return null;
    })
  );
}

export async function userAction(userId: string, action: UserAction): Promise<ActionResult<null>> {
  return withPolicyAction(Policies.admin.requireAdmin, () =>
    toActionResult(async () => {
      switch (userActionSchema.parse(action)) {
        case "activate":
          await setUserEnabled(userId, true);
          break;
        case "deactivate":
          await setUserEnabled(userId, false);
          break;
        case "resendVerification":
          await resendVerification(userId);
          break;
        case "setPassword":
          await sendSetPasswordEmail(userId);
          break;
        case "resetPassword":
          await sendPasswordResetEmail(userId);
          break;
      }
      refresh(userId);
      return null;
    })
  );
}

export async function rejectUserAction(
  userId: string,
  input: z.input<typeof rejectSchema>
): Promise<ActionResult<null>> {
  const result = await withPolicyAction(Policies.admin.requireAdmin, () =>
    toActionResult(async () => {
      const values = rejectSchema.parse(input);

      await rejectUser(userId, values.message || null, values.notify);
      refresh(userId);
      return null;
    })
  );

  if (result.ok) {
    redirect("/admin/users?status=PENDING");
  }
  return result;
}
