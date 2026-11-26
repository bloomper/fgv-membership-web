"use server";

import {revalidatePath} from "next/cache";
import type {z} from "zod";
import {setDefaultAccess} from "@/lib/defaults/defaults.server";
import {defaultAccessSchema} from "@/lib/defaults/schema";
import {type ActionResult, toActionResult} from "@/lib/graphql.server";
import {Policies} from "@/utils/policy.server";
import {withPolicyAction} from "@/utils/route.server";

/** An empty role means no access to the application. */
export async function setDefaultAccessAction(input: z.input<typeof defaultAccessSchema>): Promise<ActionResult<null>> {
    return withPolicyAction(Policies.admin.requireAdmin, () => toActionResult(async () => {
        const values = defaultAccessSchema.parse(input);

        await setDefaultAccess(values.profile, values.clientId, values.role || null);
        revalidatePath("/admin/defaults");
        return null;
    }));
}
