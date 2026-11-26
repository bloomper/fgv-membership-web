"use client";

import {useId, useTransition} from "react";
import {useTranslations} from "next-intl";
import {Controller, useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {ConfirmButton} from "@/components/confirm-button.client";
import {FormError} from "@/components/form-error";
import {acceptApplicationAction, rejectApplicationAction} from "@/app/(app)/board/applications/actions.server";
import {useActionFeedback} from "@/hooks/use-action-feedback";
import {type AcceptValues, acceptSchema, MAX_DECISION_MESSAGE, type RejectApplicationValues, rejectApplicationSchema} from "@/lib/applications/schema";

/** Accept with one of the people found (or a new spexare), or reject with a message. */
export function DecisionForms({id, people}: { id: string; people: { id: string; name: string }[] }) {
    const t = useTranslations("Applications");
    const formId = useId();
    const feedback = useActionFeedback();
    const [pending, startTransition] = useTransition();
    const accept = useForm<AcceptValues>({resolver: zodResolver(acceptSchema), defaultValues: {spexareId: ""}});
    const reject = useForm<RejectApplicationValues>({resolver: zodResolver(rejectApplicationSchema), defaultValues: {message: ""}});

    return (
        <div className="space-y-4">
            <form className="space-y-3"
                  onSubmit={accept.handleSubmit(values => startTransition(async () => {
                      feedback(await acceptApplicationAction(id, values), t("accepted"));
                  }))}>
                <Controller control={accept.control} name="spexareId" render={({field}) => (
                    <fieldset className="space-y-1">
                        <legend className="mb-1 text-sm font-medium">{t("pick")}</legend>
                        {[{id: "", name: t("createNew")}, ...people].map(person => (
                            <label key={person.id} className="flex min-h-8 items-center gap-2 text-sm">
                                <input type="radio" name={`${formId}-spexare`} value={person.id} checked={field.value === person.id}
                                       onChange={() => field.onChange(person.id)}/>
                                {person.name}
                            </label>
                        ))}
                    </fieldset>
                )}/>
                <Button type="submit" disabled={pending}>{t("accept")}</Button>
            </form>
            <form className="flex flex-wrap items-end gap-3" onSubmit={event => event.preventDefault()}>
                <div className="min-w-48 flex-1 space-y-2">
                    <Label htmlFor={`${formId}-message`}>{t("message")}</Label>
                    <Input id={`${formId}-message`} maxLength={MAX_DECISION_MESSAGE} {...reject.register("message")}/>
                    <FormError message={reject.formState.errors.message?.message}/>
                </div>
                <ConfirmButton label={t("reject")} title={t("confirmReject")} variant="outline"
                               onConfirm={async () => {
                                   if (await reject.trigger()) {
                                       feedback(await rejectApplicationAction(id, reject.getValues()), t("rejected"));
                                   }
                               }}/>
            </form>
        </div>
    );
}
