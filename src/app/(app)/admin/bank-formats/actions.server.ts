"use server";

import {revalidatePath} from "next/cache";
import type {z} from "zod";
import {deleteBankFormat, saveBankFormat} from "@/lib/bank/bank.server";
import {bankFormatSchema, toBankFormatInput} from "@/lib/bank/schema";
import {type ActionResult, toActionResult} from "@/lib/graphql.server";
import {Policies} from "@/utils/policy.server";
import {withPolicyAction} from "@/utils/route.server";

export async function saveBankFormatAction(id: string | null, input: z.input<typeof bankFormatSchema>): Promise<ActionResult<null>> {
    return withPolicyAction(Policies.admin.requireAdmin, () => toActionResult(async () => {
        await saveBankFormat(toBankFormatInput(id, bankFormatSchema.parse(input)));
        revalidatePath("/admin/bank-formats");
        return null;
    }));
}

export async function deleteBankFormatAction(id: string): Promise<ActionResult<null>> {
    return withPolicyAction(Policies.admin.requireAdmin, () => toActionResult(async () => {
        await deleteBankFormat(id);
        revalidatePath("/admin/bank-formats");
        return null;
    }));
}
