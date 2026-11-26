"use client";

import {useTransition} from "react";
import {useTranslations} from "next-intl";
import {toast} from "sonner";
import {ConfirmButton} from "@/components/confirm-button.client";
import {sendRenewalsAction} from "@/app/(app)/board/actions.server";
import {useActionFeedback} from "@/hooks/use-action-feedback";

/** Sends the reminders, after asking: they go to everyone in the group at once. */
export function RenewalForm({year, feeLevelId, count}: { year: number; feeLevelId: string; count: number }) {
    const t = useTranslations("Renewals");
    const feedback = useActionFeedback();
    const [, startTransition] = useTransition();

    return (
        <ConfirmButton variant="default" label={t("send")} title={t("confirm", {count})}
                       onConfirm={async () => {
                           await new Promise<void>(resolve => startTransition(async () => {
                               const result = await sendRenewalsAction({year, feeLevelId});

                               if (feedback(result) && result.data) {
                                   toast.success(t("done", {sent: result.data.sent, skipped: result.data.skipped}));
                               }
                               resolve();
                           }));
                       }}/>
    );
}
