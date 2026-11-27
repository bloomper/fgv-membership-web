"use client";

import {useTransition} from "react";
import {useTranslations} from "next-intl";
import {Controller, useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {Button} from "@bloomper/fgv-web-ui/ui/button";
import {Checklist} from "@/components/checklist.client";
import {FormError} from "@/components/form-error";
import {addFamilyMembersAction} from "@/app/(app)/board/actions.server";
import {useActionFeedback} from "@/hooks/use-action-feedback";
import {type FamilyValues, familySchema} from "@/lib/members/schema";

/** Attaches the people picked to a family request: they get the membership the request pays for. */
export function AttachForm({requestId, people}: { requestId: string; people: { id: string; name: string }[] }) {
    const t = useTranslations("Family");
    const feedback = useActionFeedback();
    const [pending, startTransition] = useTransition();
    const form = useForm<FamilyValues>({resolver: zodResolver(familySchema), defaultValues: {spexareIds: []}});

    return (
        <form className="space-y-3"
              onSubmit={form.handleSubmit(values => startTransition(async () => {
                  feedback(await addFamilyMembersAction(requestId, values), t("added"));
              }))}>
            <Controller control={form.control} name="spexareIds" render={({field}) => (
                <Checklist legend={t("add")} options={people.map(person => ({id: person.id, label: person.name}))}
                           value={field.value} onChange={field.onChange}/>
            )}/>
            <FormError message={form.formState.errors.spexareIds?.message}/>
            <Button type="submit" disabled={pending}>{t("addSelected")}</Button>
        </form>
    );
}
