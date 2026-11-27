"use server";

import { revalidatePath } from "next/cache";
import type { z } from "zod";
import { type ActionResult, toActionResult } from "@/lib/graphql.server";
import {
  addFamilyMembers,
  grantWaiver,
  recordPaymentWithoutRequest,
  sendPaymentLink,
  sendRenewals,
} from "@/lib/members/members.server";
import {
  familySchema,
  feesSchema,
  recordWithoutRequestSchema,
  renewalSchema,
  waiverSchema,
} from "@/lib/members/schema";
import { Policies } from "@/utils/policy.server";
import { withPolicyAction } from "@/utils/route.server";

export async function sendRenewalsAction(
  input: z.input<typeof renewalSchema>
): Promise<ActionResult<{ sent: number; skipped: number } | undefined>> {
  return withPolicyAction(Policies.board.requireBoard, () =>
    toActionResult(async () => {
      const values = renewalSchema.parse(input);

      return sendRenewals(values.year, values.feeLevelId);
    })
  );
}

export async function grantWaiverAction(
  spexareId: string,
  input: z.input<typeof waiverSchema>
): Promise<ActionResult<null>> {
  return withPolicyAction(Policies.board.requireBoard, () =>
    toActionResult(async () => {
      const values = waiverSchema.parse(input);

      await grantWaiver(spexareId, values.year, values.lifetime, values.note);
      revalidatePath(`/board/members/${spexareId}`);
      return null;
    })
  );
}

/** Only the treasurer records money. */
export async function recordWithoutRequestAction(
  spexareId: string,
  input: z.input<typeof recordWithoutRequestSchema>
): Promise<ActionResult<null>> {
  return withPolicyAction(Policies.treasurer.requireTreasurer, () =>
    toActionResult(async () => {
      const values = recordWithoutRequestSchema.parse(input);

      await recordPaymentWithoutRequest(
        spexareId,
        values.fees,
        values.paidOn,
        values.amount,
        values.how,
        values.note || null
      );
      revalidatePath(`/board/members/${spexareId}`);
      return null;
    })
  );
}

/** The answer says whether an email could be sent. */
export async function sendLinkAction(
  spexareId: string,
  input: z.input<typeof feesSchema>
): Promise<ActionResult<boolean>> {
  return withPolicyAction(Policies.board.requireBoard, () =>
    toActionResult(async () => {
      const values = feesSchema.parse(input);
      const sent = await sendPaymentLink(spexareId, values.fees);

      revalidatePath(`/board/members/${spexareId}`);
      return sent;
    })
  );
}

export async function addFamilyMembersAction(
  requestId: string,
  input: z.input<typeof familySchema>
): Promise<ActionResult<null>> {
  return withPolicyAction(Policies.board.requireBoard, () =>
    toActionResult(async () => {
      const values = familySchema.parse(input);

      await addFamilyMembers(requestId, values.spexareIds);
      revalidatePath(`/board/requests/${requestId}/family`);
      revalidatePath("/treasurer/payments");
      return null;
    })
  );
}
