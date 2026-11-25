"use client";

import { useActionState } from "react";
import { useTranslations } from "next-intl";
import { verify } from "../actions";

/** A button, not a link that acts on its own: mail scanners open links, and that must not use the token up. */
export function VerifyForm({ token }: { token: string }) {
  const t = useTranslations("verify");
  const [state, action, pending] = useActionState(verify, { status: "idle" as "idle" | "ok" | "invalid" });

  if (state.status === "ok") {
    return <p role="status">{t("done")}</p>;
  }
  return (
    <form action={action} className="space-y-4">
      {state.status === "invalid" && <p role="alert" className="text-sm text-red-600">{t("invalid")}</p>}
      <p>{t("explain")}</p>
      <input type="hidden" name="token" value={token} />
      <button className="button" type="submit" disabled={pending}>{t("confirm")}</button>
    </form>
  );
}
