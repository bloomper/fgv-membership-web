"use client";

import {useTransition} from "react";
import {useTranslations} from "next-intl";
import {Controller, useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {Button} from "@bloomper/fgv-web-ui/ui/button";
import {Checklist, type ChecklistOption} from "@/components/checklist.client";
import {ConfirmButton} from "@bloomper/fgv-web-ui/shell/confirm-button";
import {FormError} from "@/components/form-error";
import {dismissTransactionAction, matchTransactionAction} from "@/app/(app)/treasurer/actions.server";
import {useActionFeedback} from "@/hooks/use-action-feedback";
import {type MatchValues, matchSchema} from "@/lib/bank/schema";

/** Pick the request or requests the money was for; suggested ones are marked, and a single suggestion is ticked. */
export function TransactionForm({id, options, suggested}: {
    id: string;
    options: ChecklistOption[];
    suggested: { id: string; why: string }[];
}) {
    const t = useTranslations("Bank");
    const feedback = useActionFeedback();
    const [pending, startTransition] = useTransition();
    const form = useForm<MatchValues>({
        resolver: zodResolver(matchSchema),
        defaultValues: {requestIds: suggested.length === 1 ? [suggested[0].id] : []},
    });
    const marked = options
        .map(option => ({...option, hint: suggested.find(s => s.id === option.id) ? (suggested.find(s => s.id === option.id)!.why === "REFERENCE" ? t("mistypedReference") : t("suggestion")) : undefined}))
        .sort((a, b) => Number(Boolean(b.hint)) - Number(Boolean(a.hint)));

    return (
        <form className="space-y-3"
              onSubmit={form.handleSubmit(values => startTransition(async () => {
                  feedback(await matchTransactionAction(id, values), t("matched"));
              }))}>
            <Controller control={form.control} name="requestIds" render={({field}) => (
                <Checklist legend={t("pickRequests")} options={marked} value={field.value} onChange={field.onChange}/>
            )}/>
            <FormError message={form.formState.errors.requestIds?.message}/>
            <div className="flex flex-wrap gap-2">
                <Button type="submit" disabled={pending}>{t("match")}</Button>
                <ConfirmButton label={t("dismiss")} title={t("confirmDismiss")} variant="outline"
                               onConfirm={async () => {
                                   feedback(await dismissTransactionAction(id), t("dismissed"));
                               }}/>
            </div>
        </form>
    );
}
