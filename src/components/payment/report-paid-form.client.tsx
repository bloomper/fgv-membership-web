"use client";

import { useId, useTransition } from "react";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@bloomper/fgv-web-ui/ui/button";
import { Input } from "@bloomper/fgv-web-ui/ui/input";
import { Label } from "@bloomper/fgv-web-ui/ui/label";
import { FormError } from "@/components/form-error";
import { useActionFeedback } from "@/hooks/use-action-feedback";
import type { ActionResult } from "@/lib/graphql.server";
import { MAX_PAID_BY, type ReportPaidValues, reportPaidSchema } from "@/lib/membership/schema";

/** "I have paid", perhaps with who paid when it was someone else. */
export function ReportPaidForm({ report }: { report: (values: ReportPaidValues) => Promise<ActionResult<null>> }) {
  const t = useTranslations("Pay");
  const id = useId();
  const feedback = useActionFeedback();
  const [pending, startTransition] = useTransition();
  const form = useForm<ReportPaidValues>({ resolver: zodResolver(reportPaidSchema), defaultValues: { paidBy: "" } });

  return (
    <form
      className="max-w-md space-y-3"
      onSubmit={form.handleSubmit((values) =>
        startTransition(async () => {
          feedback(await report(values), t("reported"));
        })
      )}
    >
      <div className="space-y-2">
        <Label htmlFor={`${id}-paid-by`}>{t("paidBy")}</Label>
        <Input
          id={`${id}-paid-by`}
          maxLength={MAX_PAID_BY}
          placeholder={t("paidByHint")}
          {...form.register("paidBy")}
        />
        <FormError message={form.formState.errors.paidBy?.message} />
      </div>
      <Button
        type="submit"
        disabled={pending}
      >
        {t("iHavePaid")}
      </Button>
    </form>
  );
}
