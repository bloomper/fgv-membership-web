"use client";

import { useId, useTransition } from "react";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@bloomper/fgv-web-ui/ui/button";
import { Input } from "@bloomper/fgv-web-ui/ui/input";
import { Label } from "@bloomper/fgv-web-ui/ui/label";
import { Textarea } from "@bloomper/fgv-web-ui/ui/textarea";
import { FormError } from "@/components/form-error";
import { applyAction } from "@/app/(app)/membership/actions.server";
import { useActionFeedback } from "@/hooks/use-action-feedback";
import { type ApplyValues, applySchema, MAX_APPLICATION_NAME, MAX_APPLICATION_TEXT } from "@/lib/membership/schema";

/** Who you are and how you have been part of the spex, for an account that is not linked to a spexare. */
export function ApplyForm({ defaultName }: { defaultName: string }) {
  const t = useTranslations("Membership");
  const id = useId();
  const feedback = useActionFeedback();
  const [pending, startTransition] = useTransition();
  const form = useForm<ApplyValues>({
    resolver: zodResolver(applySchema),
    defaultValues: { name: defaultName, text: "" },
  });
  const { errors } = form.formState;

  return (
    <form
      className="max-w-xl space-y-4"
      onSubmit={form.handleSubmit((values) =>
        startTransition(async () => {
          feedback(await applyAction(values), t("applied"));
        })
      )}
    >
      <div className="space-y-2">
        <Label htmlFor={`${id}-name`}>{t("applyName")}</Label>
        <Input
          id={`${id}-name`}
          maxLength={MAX_APPLICATION_NAME}
          autoComplete="name"
          {...form.register("name")}
        />
        <FormError message={errors.name?.message} />
      </div>
      <div className="space-y-2">
        <Label htmlFor={`${id}-text`}>{t("applyText")}</Label>
        <Textarea
          id={`${id}-text`}
          rows={5}
          maxLength={MAX_APPLICATION_TEXT}
          placeholder={t("applyHint")}
          {...form.register("text")}
        />
        <FormError message={errors.text?.message} />
      </div>
      <Button
        type="submit"
        disabled={pending}
      >
        {t("applySubmit")}
      </Button>
    </form>
  );
}
