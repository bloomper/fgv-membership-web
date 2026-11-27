"use client";

import {useState, useTransition} from "react";
import {useTranslations} from "next-intl";
import {Button} from "@/components/ui/button";
import {verifyAction} from "@/app/(public)/register/actions.server";

/** A button, not a link that acts on its own: mail scanners open links, and that must not use the token up. */
export function VerifyForm({token}: { token: string }) {
    const t = useTranslations("Verify");
    const [pending, startTransition] = useTransition();
    const [status, setStatus] = useState<"idle" | "ok" | "invalid">("idle");

    if (status === "ok") {
        return <p role="status">{t("done")}</p>;
    }

    return (
        <div className="space-y-4">
            {status === "invalid" && <p role="alert" className="text-sm text-destructive">{t("invalid")}</p>}
            <p>{t("explain")}</p>
            <Button disabled={pending}
                    onClick={() => startTransition(async () => setStatus(await verifyAction(token) ? "ok" : "invalid"))}>
                {t("confirm")}
            </Button>
        </div>
    );
}
