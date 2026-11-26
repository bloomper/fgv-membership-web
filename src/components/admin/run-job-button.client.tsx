"use client";

import {useTransition} from "react";
import {useTranslations} from "next-intl";
import {Loader2, Play} from "lucide-react";
import {Button} from "@/components/ui/button";
import {runJobAction} from "@/app/(app)/admin/maintenance/actions.server";
import {useActionFeedback} from "@/hooks/use-action-feedback";

/** Runs a maintenance job now and refreshes the page to show how it went. */
export function RunJobButton({name}: { name: string }) {
    const t = useTranslations("Maintenance");
    const feedback = useActionFeedback();
    const [pending, startTransition] = useTransition();

    return (
        <Button variant="outline" size="sm" disabled={pending}
                onClick={() => startTransition(async () => {
                    feedback(await runJobAction(name));
                })}>
            {pending ? <Loader2 className="mr-2 size-4 animate-spin"/> : <Play className="mr-2 size-4"/>}
            {t("run")}
        </Button>
    );
}
