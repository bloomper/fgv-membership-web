"use client";

import {useId, useTransition} from "react";
import {useTranslations} from "next-intl";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {Button} from "@bloomper/fgv-web-ui/ui/button";
import {DateInput} from "@/components/date-input.client";
import {Input} from "@bloomper/fgv-web-ui/ui/input";
import {Label} from "@bloomper/fgv-web-ui/ui/label";
import {NativeSelect, NativeSelectOption} from "@bloomper/fgv-web-ui/ui/native-select";
import {ConfirmButton} from "@bloomper/fgv-web-ui/shell/confirm-button";
import {FormError} from "@/components/form-error";
import {cancelRequestAction, recordPaymentAction} from "@/app/(app)/treasurer/actions.server";
import {useActionFeedback} from "@/hooks/use-action-feedback";
import {MAX_NOTE, RECORDED_HOWS} from "@/lib/members/schema";
import {type RecordPaymentValues, recordPaymentSchema} from "@/lib/payments/schema";

/** The money arrived: when, how much and how. Or the request is dropped. */
export function RecordPaymentForm({requestId, amount, today}: { requestId: string; amount: number; today: string }) {
    const t = useTranslations("Treasurer");
    const tm = useTranslations("Members");
    const id = useId();
    const feedback = useActionFeedback();
    const [pending, startTransition] = useTransition();
    const form = useForm<RecordPaymentValues>({resolver: zodResolver(recordPaymentSchema), defaultValues: {paidOn: today, amount, how: "SWISH", note: ""}});
    const {errors} = form.formState;

    return (
        <form className="flex flex-wrap items-start gap-3"
              onSubmit={form.handleSubmit(values => startTransition(async () => {
                  feedback(await recordPaymentAction(requestId, values), t("recordedDone"));
              }))}>
            <div className="space-y-2">
                <Label htmlFor={`${id}-date`}>{t("date")}</Label>
                <DateInput id={`${id}-date`} {...form.register("paidOn")}/>
                <FormError message={errors.paidOn?.message}/>
            </div>
            <div className="space-y-2">
                <Label htmlFor={`${id}-amount`}>{t("amount")}</Label>
                <Input id={`${id}-amount`} className="w-28" type="number" min={1} {...form.register("amount", {valueAsNumber: true})}/>
                <FormError message={errors.amount?.message}/>
            </div>
            <div className="space-y-2">
                <Label htmlFor={`${id}-how`}>{t("how")}</Label>
                <NativeSelect id={`${id}-how`} {...form.register("how")}>
                    {RECORDED_HOWS.map(how => <NativeSelectOption key={how} value={how}>{tm(`hows.${how}`)}</NativeSelectOption>)}
                </NativeSelect>
            </div>
            <div className="min-w-40 flex-1 space-y-2">
                <Label htmlFor={`${id}-note`}>{t("note")}</Label>
                <Input id={`${id}-note`} maxLength={MAX_NOTE} {...form.register("note")}/>
            </div>
            <div className="flex gap-2 self-end">
                <Button type="submit" disabled={pending}>{t("record")}</Button>
                <ConfirmButton label={t("cancel")} title={t("confirmCancel")} variant="outline"
                               onConfirm={async () => {
                                   feedback(await cancelRequestAction(requestId), t("cancelled"));
                               }}/>
            </div>
        </form>
    );
}
