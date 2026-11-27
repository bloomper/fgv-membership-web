"use server";

import { revalidatePath } from "next/cache";
import type { z } from "zod";
import { acceptApplication, rejectApplication } from "@/lib/applications/applications.server";
import { acceptSchema, rejectApplicationSchema } from "@/lib/applications/schema";
import { type ActionResult, toActionResult } from "@/lib/graphql.server";
import { Policies } from "@/utils/policy.server";
import { withPolicyAction } from "@/utils/route.server";

/** Accepts with the spexare the board picked, or, when none is picked, with one created from the account. */
export async function acceptApplicationAction(
  id: string,
  input: z.input<typeof acceptSchema>
): Promise<ActionResult<null>> {
  return withPolicyAction(Policies.board.requireBoard, () =>
    toActionResult(async () => {
      const values = acceptSchema.parse(input);

      await acceptApplication(id, values.spexareId || null);
      revalidatePath("/board/applications");
      return null;
    })
  );
}

export async function rejectApplicationAction(
  id: string,
  input: z.input<typeof rejectApplicationSchema>
): Promise<ActionResult<null>> {
  return withPolicyAction(Policies.board.requireBoard, () =>
    toActionResult(async () => {
      const values = rejectApplicationSchema.parse(input);

      await rejectApplication(id, values.message || null);
      revalidatePath("/board/applications");
      return null;
    })
  );
}
