"use client";

import {useId, useTransition} from "react";
import {useTranslations} from "next-intl";
import {Controller, useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {Button} from "@bloomper/fgv-web-ui/ui/button";
import {Checkbox} from "@bloomper/fgv-web-ui/ui/checkbox";
import {Label} from "@bloomper/fgv-web-ui/ui/label";
import {NativeSelect, NativeSelectOption} from "@bloomper/fgv-web-ui/ui/native-select";
import {Textarea} from "@bloomper/fgv-web-ui/ui/textarea";
import {ConfirmButton} from "@bloomper/fgv-web-ui/shell/confirm-button";
import {FormError} from "@/components/form-error";
import {rejectUserAction, setAccessAction, userAction} from "@/app/(app)/admin/users/actions.server";
import {useActionFeedback} from "@/hooks/use-action-feedback";
import {
    type AccessValues,
    accessSchema,
    MAX_REJECT_MESSAGE,
    type RejectValues,
    rejectSchema,
    type UserAction,
} from "@/lib/users/schema";

/** The highest role on one application; the roles below it come with it, and an empty choice takes everything away. */
export function AccessForm({userId, clientId, ladder, highest}: { userId: string; clientId: string; ladder: string[]; highest: string | null }) {
    const t = useTranslations("Users");
    const id = useId();
    const feedback = useActionFeedback();
    const [pending, startTransition] = useTransition();
    const form = useForm<AccessValues>({resolver: zodResolver(accessSchema), defaultValues: {clientId, role: highest ?? "", notify: true}});

    return (
        <form className="flex flex-wrap items-center gap-3"
              onSubmit={form.handleSubmit(values => startTransition(async () => {
                  feedback(await setAccessAction(userId, values), t("saved"));
              }))}>
            <NativeSelect aria-label={t("role")} {...form.register("role")}>
                <NativeSelectOption value="">{t("noAccess")}</NativeSelectOption>
                {ladder.map(role => <NativeSelectOption key={role} value={role}>{role}</NativeSelectOption>)}
            </NativeSelect>
            <div className="flex min-h-9 items-center gap-2">
                <Controller control={form.control} name="notify" render={({field}) => (
                    <Checkbox id={`${id}-notify`} checked={field.value} onCheckedChange={value => field.onChange(value === true)}/>
                )}/>
                <Label htmlFor={`${id}-notify`} className="text-sm">{t("notify")}</Label>
            </div>
            <Button type="submit" variant="outline" disabled={pending}>{t("save")}</Button>
        </form>
    );
}

/** Activate, deactivate and the emails an administrator can send; deactivating asks first. */
export function UserActionButton({userId, action, label, confirm}: { userId: string; action: UserAction; label: string; confirm?: string }) {
    const t = useTranslations("Users");
    const feedback = useActionFeedback();
    const [pending, startTransition] = useTransition();

    if (confirm) {
        return (
            <ConfirmButton label={label} title={confirm}
                           onConfirm={async () => {
                               feedback(await userAction(userId, action), t("done"));
                           }}/>
        );
    }
    return (
        <Button variant="outline" disabled={pending}
                onClick={() => startTransition(async () => {
                    feedback(await userAction(userId, action), t("done"));
                })}>
            {label}
        </Button>
    );
}

/** Deletes an account that waits for approval, with a message to the user if wanted. */
export function RejectForm({userId}: { userId: string }) {
    const t = useTranslations("Users");
    const id = useId();
    const feedback = useActionFeedback();
    const form = useForm<RejectValues>({resolver: zodResolver(rejectSchema), defaultValues: {message: "", notify: true}});

    return (
        <form className="max-w-xl space-y-3" onSubmit={event => event.preventDefault()}>
            <div className="space-y-2">
                <Label htmlFor={`${id}-message`}>{t("rejectMessage")}</Label>
                <Textarea id={`${id}-message`} rows={3} maxLength={MAX_REJECT_MESSAGE} {...form.register("message")}/>
                <FormError message={form.formState.errors.message?.message}/>
            </div>
            <div className="flex min-h-9 items-center gap-2">
                <Controller control={form.control} name="notify" render={({field}) => (
                    <Checkbox id={`${id}-notify`} checked={field.value} onCheckedChange={value => field.onChange(value === true)}/>
                )}/>
                <Label htmlFor={`${id}-notify`} className="text-sm">{t("notify")}</Label>
            </div>
            <ConfirmButton label={t("rejectSubmit")} title={t("confirmReject")} variant="destructive"
                           onConfirm={async () => {
                               if (await form.trigger()) {
                                   feedback(await rejectUserAction(userId, form.getValues()));
                               }
                           }}/>
        </form>
    );
}
