"use server";

import { revalidatePath } from "next/cache";
import type { z } from "zod";
import { type ActionResult, toActionResult } from "@/lib/graphql.server";
import { applyForMembership, reportPaid, requestPayment } from "@/lib/membership/membership.server";
import { applySchema, payRequestSchema, reportPaidSchema } from "@/lib/membership/schema";
import { Policies } from "@/utils/policy.server";
import { withPolicyAction } from "@/utils/route.server";

export async function applyAction(input: z.input<typeof applySchema>): Promise<ActionResult<null>> {
  return withPolicyAction(Policies.app.requireAccess, () =>
    toActionResult(async () => {
      const values = applySchema.parse(input);

      await applyForMembership(values.name, values.text);
      revalidatePath("/membership");
      return null;
    })
  );
}

/** Asks to pay the fees that were ticked; the answer is the request to show how to pay. */
export async function requestPaymentAction(
  input: z.input<typeof payRequestSchema>
): Promise<ActionResult<string | undefined>> {
  return withPolicyAction(Policies.app.requireAccess, () =>
    toActionResult(async () => {
      const values = payRequestSchema.parse(input);

      return requestPayment(values.feeLevelIds, values.familyNote || null);
    })
  );
}

export async function reportPaidAction(
  id: string,
  input: z.input<typeof reportPaidSchema>
): Promise<ActionResult<null>> {
  return withPolicyAction(Policies.app.requireAccess, () =>
    toActionResult(async () => {
      const values = reportPaidSchema.parse(input);

      await reportPaid(id, values.paidBy || null);
      revalidatePath(`/membership/pay/${id}`);
      revalidatePath("/membership");
      return null;
    })
  );
}
