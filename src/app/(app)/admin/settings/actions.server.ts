"use server";

import { revalidatePath } from "next/cache";
import type { z } from "zod";
import { type ActionResult, toActionResult } from "@/lib/graphql.server";
import { settingsSchema, toSettingsInput } from "@/lib/settings/schema";
import { saveSettings } from "@/lib/settings/settings.server";
import { Policies } from "@/utils/policy.server";
import { withPolicyAction } from "@/utils/route.server";

export async function saveSettingsAction(input: z.input<typeof settingsSchema>): Promise<ActionResult<null>> {
  return withPolicyAction(Policies.admin.requireAdmin, () =>
    toActionResult(async () => {
      await saveSettings(toSettingsInput(settingsSchema.parse(input)));
      revalidatePath("/admin/settings");
      return null;
    })
  );
}
