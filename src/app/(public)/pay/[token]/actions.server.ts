"use server";

import {revalidatePath} from "next/cache";
import type {z} from "zod";
import {apiFetchPublic} from "@/lib/api.server";
import type {ActionResult} from "@/lib/graphql.server";
import {reportPaidSchema} from "@/lib/membership/schema";

// A personal link is its own credential: the token in the address is all the server asks for.

const TOKEN = /^[A-Za-z0-9_-]{20,100}$/;

async function post(token: string, action: "report" | "opt-out", body?: object): Promise<ActionResult<null>> {
    if (!TOKEN.test(token)) {
        return {ok: false, code: "NOT_FOUND", message: ""};
    }

    const response = await apiFetchPublic(`/api/personal/${encodeURIComponent(token)}/${action}`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: body ? JSON.stringify(body) : undefined,
    });

    revalidatePath(`/pay/${token}`);
    return response.ok ? {ok: true, data: null} : {ok: false, code: response.status === 404 ? "NOT_FOUND" : response.status === 429 ? "FORBIDDEN" : "INTERNAL_ERROR", message: ""};
}

export async function reportPaidByLinkAction(token: string, input: z.input<typeof reportPaidSchema>): Promise<ActionResult<null>> {
    const values = reportPaidSchema.parse(input);

    return post(token, "report", {paidBy: values.paidBy || null});
}

export async function optOutByLinkAction(token: string): Promise<ActionResult<null>> {
    return post(token, "opt-out");
}
