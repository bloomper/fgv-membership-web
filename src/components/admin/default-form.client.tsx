"use client";

import {useTransition} from "react";
import {useTranslations} from "next-intl";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {Button} from "@bloomper/fgv-web-ui/ui/button";
import {NativeSelect, NativeSelectOption} from "@bloomper/fgv-web-ui/ui/native-select";
import {setDefaultAccessAction} from "@/app/(app)/admin/defaults/actions.server";
import {useActionFeedback} from "@/hooks/use-action-feedback";
import {type DefaultAccessValues, defaultAccessSchema} from "@/lib/defaults/schema";

/** The highest role a new account gets on one application. */
export function DefaultForm({profile, clientId, name, ladder, role}: {
    profile: DefaultAccessValues["profile"];
    clientId: string;
    name: string;
    ladder: string[];
    role: string | null;
}) {
    const t = useTranslations("Defaults");
    const feedback = useActionFeedback();
    const [pending, startTransition] = useTransition();
    const form = useForm<DefaultAccessValues>({resolver: zodResolver(defaultAccessSchema), defaultValues: {profile, clientId, role: role ?? ""}});

    return (
        <form className="flex flex-wrap items-center gap-3"
              onSubmit={form.handleSubmit(values => startTransition(async () => {
                  feedback(await setDefaultAccessAction(values), t("saved"));
              }))}>
            <span className="w-48 font-medium">{name}</span>
            <NativeSelect aria-label={name} {...form.register("role")}>
                <NativeSelectOption value="">{t("none")}</NativeSelectOption>
                {ladder.map(option => <NativeSelectOption key={option} value={option}>{option}</NativeSelectOption>)}
            </NativeSelect>
            <Button type="submit" variant="outline" disabled={pending}>{t("save")}</Button>
        </form>
    );
}
