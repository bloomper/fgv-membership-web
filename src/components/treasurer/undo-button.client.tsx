"use client";

import {useTranslations} from "next-intl";
import {ConfirmButton} from "@/components/confirm-button.client";
import {undoPaymentAction} from "@/app/(app)/treasurer/actions.server";
import {useActionFeedback} from "@/hooks/use-action-feedback";

export function UndoButton({id}: { id: string }) {
    const t = useTranslations("Treasurer");
    const feedback = useActionFeedback();

    return (
        <ConfirmButton label={t("undo")} title={t("confirmUndo")} variant="ghost" size="sm"
                       onConfirm={async () => {
                           feedback(await undoPaymentAction(id), t("undone"));
                       }}/>
    );
}
