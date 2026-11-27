"use client";

import {useId, useTransition} from "react";
import {useTranslations} from "next-intl";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {Button} from "@bloomper/fgv-web-ui/ui/button";
import {Input} from "@bloomper/fgv-web-ui/ui/input";
import {Label} from "@bloomper/fgv-web-ui/ui/label";
import {Textarea} from "@bloomper/fgv-web-ui/ui/textarea";
import {FormError} from "@/components/form-error";
import {saveSettingsAction} from "@/app/(app)/admin/settings/actions.server";
import {useActionFeedback} from "@/hooks/use-action-feedback";
import {type SettingsValues, settingsSchema} from "@/lib/settings/schema";

/** Where members pay, who is told about payments, and when payers are reminded. */
export function SettingsForm({settings}: { settings: SettingsValues }) {
    const t = useTranslations("Settings");
    const id = useId();
    const feedback = useActionFeedback();
    const [pending, startTransition] = useTransition();
    const form = useForm<SettingsValues>({resolver: zodResolver(settingsSchema), values: settings});
    const {errors} = form.formState;
    const text = (name: "swishNumber" | "bankgiro" | "bankAccount" | "payeeName", label: string) => (
        <div className="space-y-2">
            <Label htmlFor={`${id}-${name}`}>{label}</Label>
            <Input id={`${id}-${name}`} {...form.register(name)}/>
            <FormError message={errors[name]?.message}/>
        </div>
    );

    return (
        <form className="max-w-xl space-y-4"
              onSubmit={form.handleSubmit(values => startTransition(async () => {
                  feedback(await saveSettingsAction(values), t("saved"));
              }))}>
            {text("swishNumber", t("swish"))}
            {text("bankgiro", t("bankgiro"))}
            {text("bankAccount", t("bank"))}
            {text("payeeName", t("payee"))}
            <div className="space-y-2">
                <Label htmlFor={`${id}-days`}>{t("days")}</Label>
                <Input id={`${id}-days`} className="w-24" type="number" min={1} max={60} {...form.register("reminderDays", {valueAsNumber: true})}/>
                <FormError message={errors.reminderDays?.message}/>
            </div>
            <div className="space-y-2">
                <Label htmlFor={`${id}-recipients`}>{t("recipients")}</Label>
                <Textarea id={`${id}-recipients`} rows={3} placeholder={t("recipientsHint")} {...form.register("recipients")}/>
                <FormError message={errors.recipients?.message}/>
            </div>
            <Button type="submit" disabled={pending}>{t("save")}</Button>
        </form>
    );
}
