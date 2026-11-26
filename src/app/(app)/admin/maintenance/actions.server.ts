"use server";

import {revalidatePath} from "next/cache";
import {type ActionResult, toActionResult} from "@/lib/graphql.server";
import {runMaintenanceJob} from "@/lib/maintenance/maintenance.server";
import {Policies} from "@/utils/policy.server";
import {withPolicyAction} from "@/utils/route.server";

/** Runs a job now; the server knows its jobs by name and refuses any other. */
export async function runJobAction(name: string): Promise<ActionResult<string | null | undefined>> {
    return withPolicyAction(Policies.admin.requireAdmin, () => toActionResult(async () => {
        const job = await runMaintenanceJob(name);

        revalidatePath("/admin/maintenance");
        return job?.lastResult;
    }));
}
