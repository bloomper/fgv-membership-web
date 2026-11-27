"use server";

import { revalidatePath } from "next/cache";
import type { z } from "zod";
import {
  importStatement as importStatementFile,
  dismissTransaction,
  getBankFormats,
  matchTransaction,
} from "@/lib/bank/bank.server";
import { type ActionResult, toActionResult } from "@/lib/graphql.server";
import { matchSchema } from "@/lib/bank/schema";
import { cancelPaymentRequest, recordPayment, undoPayment } from "@/lib/payments/payments.server";
import { recordPaymentSchema } from "@/lib/payments/schema";
import { Policies } from "@/utils/policy.server";
import { withPolicyAction } from "@/utils/route.server";

export type ImportSummary = {
  read: number;
  added: number;
  duplicates: number;
  outgoing: number;
  matched: number;
  errors: string[];
};

export async function recordPaymentAction(
  requestId: string,
  input: z.input<typeof recordPaymentSchema>
): Promise<ActionResult<null>> {
  return withPolicyAction(Policies.treasurer.requireTreasurer, () =>
    toActionResult(async () => {
      const values = recordPaymentSchema.parse(input);

      await recordPayment(requestId, values.paidOn, values.amount, values.how, values.note || null);
      revalidatePath("/treasurer/payments");
      return null;
    })
  );
}

export async function cancelRequestAction(requestId: string): Promise<ActionResult<null>> {
  return withPolicyAction(Policies.treasurer.requireTreasurer, () =>
    toActionResult(async () => {
      await cancelPaymentRequest(requestId);
      revalidatePath("/treasurer/payments");
      return null;
    })
  );
}

export async function undoPaymentAction(id: string): Promise<ActionResult<null>> {
  return withPolicyAction(Policies.treasurer.requireTreasurer, () =>
    toActionResult(async () => {
      await undoPayment(id);
      revalidatePath("/treasurer/payments");
      revalidatePath("/treasurer/transactions");
      return null;
    })
  );
}

/** Matches a transaction to one request, or splits it over several. */
export async function matchTransactionAction(
  id: string,
  input: z.input<typeof matchSchema>
): Promise<ActionResult<null>> {
  return withPolicyAction(Policies.treasurer.requireTreasurer, () =>
    toActionResult(async () => {
      const values = matchSchema.parse(input);

      await matchTransaction(id, values.requestIds);
      revalidatePath("/treasurer/transactions");
      revalidatePath("/treasurer/payments");
      return null;
    })
  );
}

export async function dismissTransactionAction(id: string): Promise<ActionResult<null>> {
  return withPolicyAction(Policies.treasurer.requireTreasurer, () =>
    toActionResult(async () => {
      await dismissTransaction(id);
      revalidatePath("/treasurer/transactions");
      return null;
    })
  );
}

/** The file is decoded with the charset of the bank's format, which banks do not agree on. */
export async function importFileAction(form: FormData): Promise<ActionResult<ImportSummary | undefined>> {
  return withPolicyAction(Policies.treasurer.requireTreasurer, () =>
    toActionResult(async () => {
      const file = form.get("file");
      const formatId = String(form.get("formatId") ?? "");

      if (!(file instanceof File) || file.size === 0) {
        throw new Error("No file");
      }

      const format = (await getBankFormats()).find((candidate) => candidate.id === formatId);

      if (!format) {
        throw new Error("Unknown format");
      }

      const content = new TextDecoder(format.charset).decode(await file.arrayBuffer());
      const result = await importStatementFile(formatId, file.name, content);

      revalidatePath("/treasurer/transactions");
      return result;
    })
  );
}
