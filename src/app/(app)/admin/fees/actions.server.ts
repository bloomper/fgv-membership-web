"use server";

import {revalidatePath} from "next/cache";
import type {z} from "zod";
import {retireFeeLevel, saveFeeLevel} from "@/lib/fees/fees.server";
import {feeSchema, toFeeLevelInput} from "@/lib/fees/schema";
import {type ActionResult, toActionResult} from "@/lib/graphql.server";
import {Policies} from "@/utils/policy.server";
import {withPolicyAction} from "@/utils/route.server";

export async function saveFeeAction(id: string | null, input: z.input<typeof feeSchema>): Promise<ActionResult<null>> {
    return withPolicyAction(Policies.admin.requireAdmin, () => toActionResult(async () => {
        await saveFeeLevel(toFeeLevelInput(id, feeSchema.parse(input)));
        revalidatePath("/admin/fees");
        return null;
    }));
}

export async function retireFeeAction(id: string, retired: boolean): Promise<ActionResult<null>> {
    return withPolicyAction(Policies.admin.requireAdmin, () => toActionResult(async () => {
        await retireFeeLevel(id, retired);
        revalidatePath("/admin/fees");
        return null;
    }));
}
