"use client";

import { useId, useTransition } from "react";
import { useTranslations } from "next-intl";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@bloomper/fgv-web-ui/ui/button";
import { Checkbox } from "@bloomper/fgv-web-ui/ui/checkbox";
import { Input } from "@bloomper/fgv-web-ui/ui/input";
import { Label } from "@bloomper/fgv-web-ui/ui/label";
import { ConfirmButton } from "@bloomper/fgv-web-ui/shell/confirm-button";
import { FormError } from "@/components/form-error";
import { deleteBankFormatAction, saveBankFormatAction } from "@/app/(app)/admin/bank-formats/actions.server";
import { useActionFeedback } from "@/hooks/use-action-feedback";
import { type BankFormatValues, bankFormatSchema } from "@/lib/bank/schema";

export type BankFormatRow = BankFormatValues & { id: string };

const optionalNumber = (value: unknown) =>
  value === "" || value === null || value === undefined ? null : Number(value);

/** How one bank's CSV is laid out; with no format given, a new one. */
export function BankFormatForm({ format }: { format: BankFormatRow | null }) {
  const t = useTranslations("Formats");
  const id = useId();
  const feedback = useActionFeedback();
  const [pending, startTransition] = useTransition();
  const form = useForm<BankFormatValues>({
    resolver: zodResolver(bankFormatSchema),
    defaultValues: format ?? {
      name: "",
      charset: "UTF-8",
      delimiter: ";",
      headerLines: 1,
      dateColumn: undefined,
      amountColumn: undefined,
      textColumn: undefined,
      payerColumn: null,
      dateFormat: "yyyy-MM-dd",
      decimalComma: true,
    },
  });
  const { errors } = form.formState;
  const field = (name: "name" | "charset" | "delimiter" | "dateFormat", label: string, className?: string) => (
    <div className="space-y-2">
      <Label htmlFor={`${id}-${name}`}>{label}</Label>
      <Input
        id={`${id}-${name}`}
        className={className}
        {...form.register(name)}
      />
      <FormError message={errors[name]?.message} />
    </div>
  );
  const column = (name: "headerLines" | "dateColumn" | "amountColumn" | "textColumn", label: string) => (
    <div className="space-y-2">
      <Label htmlFor={`${id}-${name}`}>{label}</Label>
      <Input
        id={`${id}-${name}`}
        className="w-20"
        type="number"
        min={0}
        {...form.register(name, { valueAsNumber: true })}
      />
      <FormError message={errors[name]?.message} />
    </div>
  );

  return (
    <form
      className="flex flex-wrap items-start gap-3"
      onSubmit={form.handleSubmit((values) =>
        startTransition(async () => {
          const result = await saveBankFormatAction(format?.id ?? null, values);

          if (feedback(result, t("saved")) && !format) {
            form.reset();
          }
        })
      )}
    >
      {field("name", t("name"))}
      {field("charset", t("charset"), "w-28")}
      {field("delimiter", t("delimiter"), "w-16")}
      {column("headerLines", t("headerLines"))}
      {column("dateColumn", t("dateColumn"))}
      {column("amountColumn", t("amountColumn"))}
      {column("textColumn", t("textColumn"))}
      <div className="space-y-2">
        <Label htmlFor={`${id}-payer`}>{t("payerColumn")}</Label>
        <Input
          id={`${id}-payer`}
          className="w-20"
          type="number"
          min={1}
          {...form.register("payerColumn", { setValueAs: optionalNumber })}
        />
        <FormError message={errors.payerColumn?.message} />
      </div>
      {field("dateFormat", t("dateFormat"), "w-32")}
      <div className="flex min-h-9 items-center gap-2 self-end">
        <Controller
          control={form.control}
          name="decimalComma"
          render={({ field: control }) => (
            <Checkbox
              id={`${id}-comma`}
              checked={control.value}
              onCheckedChange={(value) => control.onChange(value === true)}
            />
          )}
        />
        <Label htmlFor={`${id}-comma`}>{t("decimalComma")}</Label>
      </div>
      <div className="flex gap-2 self-end">
        <Button
          type="submit"
          variant="outline"
          disabled={pending}
        >
          {t("save")}
        </Button>
        {format && (
          <ConfirmButton
            label={t("delete")}
            title={t("confirmDelete")}
            variant="ghost"
            onConfirm={async () => {
              feedback(await deleteBankFormatAction(format.id), t("deleted"));
            }}
          />
        )}
      </div>
    </form>
  );
}
