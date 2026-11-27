"use client";

import {useId, useState, useTransition} from "react";
import {useTranslations} from "next-intl";
import {Controller, useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {Button} from "@/components/ui/button";
import {Checkbox} from "@/components/ui/checkbox";
import {DateInput} from "@/components/date-input.client";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {NativeSelect, NativeSelectOption} from "@/components/ui/native-select";
import {Checklist, type ChecklistOption} from "@/components/checklist.client";
import {FormError} from "@/components/form-error";
import {grantWaiverAction, recordWithoutRequestAction, sendLinkAction} from "@/app/(app)/board/actions.server";
import {useActionFeedback} from "@/hooks/use-action-feedback";
import {
    type FeesValues,
    feesSchema,
    MAX_NOTE,
    RECORDED_HOWS,
    type RecordWithoutRequestValues,
    recordWithoutRequestSchema,
    type WaiverValues,
    waiverSchema,
} from "@/lib/members/schema";

/** A membership without a fee, for the year or for life from it, and why. */
export function WaiverForm({spexareId, year}: { spexareId: string; year: number }) {
    const t = useTranslations("Member");
    const id = useId();
    const feedback = useActionFeedback();
    const [pending, startTransition] = useTransition();
    const form = useForm<WaiverValues>({resolver: zodResolver(waiverSchema), defaultValues: {year, lifetime: false, note: ""}});
    const {errors} = form.formState;

    return (
        <form className="flex flex-wrap items-end gap-3"
              onSubmit={form.handleSubmit(values => startTransition(async () => {
                  feedback(await grantWaiverAction(spexareId, values), t("granted"));
              }))}>
            <div className="space-y-2">
                <Label htmlFor={`${id}-year`}>{t("year")}</Label>
                <Input id={`${id}-year`} className="w-24" type="number" {...form.register("year", {valueAsNumber: true})}/>
                <FormError message={errors.year?.message}/>
            </div>
            <div className="flex min-h-9 items-center gap-2">
                <Controller control={form.control} name="lifetime" render={({field}) => (
                    <Checkbox id={`${id}-lifetime`} checked={field.value} onCheckedChange={value => field.onChange(value === true)}/>
                )}/>
                <Label htmlFor={`${id}-lifetime`}>{t("lifetime")}</Label>
            </div>
            <div className="min-w-48 flex-1 space-y-2">
                <Label htmlFor={`${id}-note`}>{t("note")}</Label>
                <Input id={`${id}-note`} maxLength={MAX_NOTE} {...form.register("note")}/>
                <FormError message={errors.note?.message}/>
            </div>
            <Button type="submit" variant="outline" disabled={pending}>{t("grant")}</Button>
        </form>
    );
}

/** Asks the member to pay: a request, and an email with a personal link. */
export function SendLinkForm({spexareId, options}: { spexareId: string; options: ChecklistOption[] }) {
    const t = useTranslations("Member");
    const feedback = useActionFeedback();
    const [pending, startTransition] = useTransition();
    const [notSent, setNotSent] = useState(false);
    const form = useForm<FeesValues>({resolver: zodResolver(feesSchema), defaultValues: {fees: []}});

    return (
        <form className="space-y-3"
              onSubmit={form.handleSubmit(values => startTransition(async () => {
                  const result = await sendLinkAction(spexareId, values);

                  setNotSent(result.ok && !result.data);
                  feedback(result, result.ok && result.data ? t("sent") : undefined);
              }))}>
            <Controller control={form.control} name="fees" render={({field}) => (
                <Checklist legend={t("fees")} options={options} value={field.value} onChange={field.onChange}/>
            )}/>
            <FormError message={form.formState.errors.fees?.message}/>
            {notSent && <p role="status" className="text-sm">{t("notSent")}</p>}
            <Button type="submit" variant="outline" disabled={pending}>{t("send")}</Button>
        </form>
    );
}

/** A payment that has no request yet: the request is made and marked paid at once. */
export function RecordWithoutRequestForm({spexareId, options, today}: { spexareId: string; options: ChecklistOption[]; today: string }) {
    const t = useTranslations("Member");
    const tm = useTranslations("Members");
    const id = useId();
    const feedback = useActionFeedback();
    const [pending, startTransition] = useTransition();
    const form = useForm<RecordWithoutRequestValues>({
        resolver: zodResolver(recordWithoutRequestSchema),
        defaultValues: {fees: [], paidOn: today, amount: undefined, how: "SWISH", note: ""},
    });
    const {errors} = form.formState;

    return (
        <form className="space-y-3"
              onSubmit={form.handleSubmit(values => startTransition(async () => {
                  feedback(await recordWithoutRequestAction(spexareId, values), t("recorded"));
              }))}>
            <Controller control={form.control} name="fees" render={({field}) => (
                <Checklist legend={t("fees")} options={options} value={field.value} onChange={field.onChange}/>
            )}/>
            <FormError message={errors.fees?.message}/>
            <div className="flex flex-wrap items-start gap-3">
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
                <div className="min-w-48 flex-1 space-y-2">
                    <Label htmlFor={`${id}-note`}>{t("note")}</Label>
                    <Input id={`${id}-note`} maxLength={MAX_NOTE} {...form.register("note")}/>
                </div>
            </div>
            <Button type="submit" variant="outline" disabled={pending}>{t("recordSubmit")}</Button>
        </form>
    );
}
