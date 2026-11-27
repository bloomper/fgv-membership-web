"use client";

import {useTransition} from "react";
import {useTranslations} from "next-intl";
import {Button} from "@bloomper/fgv-web-ui/ui/button";
import {useActionFeedback} from "@/hooks/use-action-feedback";
import type {ActionResult} from "@/lib/graphql.server";

/** Asks to be left alone: no more reminders for this request. */
export function OptOutButton({optOut}: { optOut: () => Promise<ActionResult<null>> }) {
    const t = useTranslations("Personal");
    const feedback = useActionFeedback();
    const [pending, startTransition] = useTransition();

    return (
        <Button variant="outline" size="sm" disabled={pending}
                onClick={() => startTransition(async () => {
                    feedback(await optOut(), t("optedOut"));
                })}>
            {t("optOut")}
        </Button>
    );
}
