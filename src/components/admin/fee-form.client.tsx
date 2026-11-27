"use client";

import { useId, useTransition } from "react";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@bloomper/fgv-web-ui/ui/button";
import { Input } from "@bloomper/fgv-web-ui/ui/input";
import { Label } from "@bloomper/fgv-web-ui/ui/label";
import { NativeSelect, NativeSelectOption } from "@bloomper/fgv-web-ui/ui/native-select";
import { FormError } from "@/components/form-error";
import { retireFeeAction, saveFeeAction } from "@/app/(app)/admin/fees/actions.server";
import { useActionFeedback } from "@/hooks/use-action-feedback";
import { FEE_KINDS, type FeeValues, feeSchema } from "@/lib/fees/schema";

export type FeeRow = {
  id: string;
  year: number | null;
  kind: FeeValues["kind"];
  nameSv: string;
  nameEn: string;
  amount: number;
  retired: boolean;
};

/** A fee level; with no fee given, a new one. */
export function FeeForm({ fee }: { fee: FeeRow | null }) {
  const t = useTranslations("Fees");
  const id = useId();
  const feedback = useActionFeedback();
  const [pending, startTransition] = useTransition();
  const form = useForm<FeeValues>({
    resolver: zodResolver(feeSchema),
    defaultValues: fee
      ? { kind: fee.kind, year: fee.year, nameSv: fee.nameSv, nameEn: fee.nameEn, amount: fee.amount }
      : { kind: "STANDARD", year: new Date().getFullYear() + 1, nameSv: "", nameEn: "", amount: undefined },
  });
  const { errors } = form.formState;

  return (
    <form
      className="flex flex-wrap items-start gap-3"
      onSubmit={form.handleSubmit((values) =>
        startTransition(async () => {
          const result = await saveFeeAction(fee?.id ?? null, values);

          if (feedback(result, t("saved")) && !fee) {
            form.reset();
          }
        })
      )}
    >
      <div className="space-y-2">
        <Label htmlFor={`${id}-kind`}>{t("kind")}</Label>
        <NativeSelect
          id={`${id}-kind`}
          {...form.register("kind")}
        >
          {FEE_KINDS.map((kind) => (
            <NativeSelectOption
              key={kind}
              value={kind}
            >
              {t(`kinds.${kind}`)}
            </NativeSelectOption>
          ))}
        </NativeSelect>
      </div>
      <div className="space-y-2">
        <Label htmlFor={`${id}-year`}>{t("year")}</Label>
        <Input
          id={`${id}-year`}
          className="w-24"
          type="number"
          {...form.register("year", { setValueAs: (value) => (value === "" || value === null ? null : Number(value)) })}
        />
        <FormError message={errors.year?.message} />
      </div>
      <div className="space-y-2">
        <Label htmlFor={`${id}-sv`}>{t("nameSv")}</Label>
        <Input
          id={`${id}-sv`}
          maxLength={100}
          {...form.register("nameSv")}
        />
        <FormError message={errors.nameSv?.message} />
      </div>
      <div className="space-y-2">
        <Label htmlFor={`${id}-en`}>{t("nameEn")}</Label>
        <Input
          id={`${id}-en`}
          maxLength={100}
          {...form.register("nameEn")}
        />
        <FormError message={errors.nameEn?.message} />
      </div>
      <div className="space-y-2">
        <Label htmlFor={`${id}-amount`}>{t("amount")}</Label>
        <Input
          id={`${id}-amount`}
          className="w-24"
          type="number"
          min={0}
          {...form.register("amount", { valueAsNumber: true })}
        />
        <FormError message={errors.amount?.message} />
      </div>
      <div className="flex gap-2 self-end">
        <Button
          type="submit"
          variant="outline"
          disabled={pending}
        >
          {t("save")}
        </Button>
        {fee && (
          <Button
            type="button"
            variant="ghost"
            disabled={pending}
            onClick={() =>
              startTransition(async () => {
                feedback(await retireFeeAction(fee.id, !fee.retired));
              })
            }
          >
            {fee.retired ? t("restore") : t("retire")}
          </Button>
        )}
      </div>
    </form>
  );
}
