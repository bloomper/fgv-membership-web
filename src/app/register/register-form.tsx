"use client";

import { useActionState, useEffect } from "react";
import Script from "next/script";
import { useTranslations } from "next-intl";
import { register, type RegisterState } from "./actions";

declare global {
  interface Window {
    turnstile?: { reset: () => void };
  }
}

export function RegisterForm({ siteKey }: { siteKey: string }) {
  const t = useTranslations("register");
  const [state, action, pending] = useActionState<RegisterState, FormData>(register, { status: "idle" });

  // A Turnstile response works once: ask for a new one after every try
  useEffect(() => {
    if (state.status === "error") {
      window.turnstile?.reset();
    }
  }, [state]);

  if (state.status === "sent") {
    return (
      <div role="status" className="rounded-lg border border-zinc-300 p-4 dark:border-zinc-700">
        <p className="font-medium">{t("sentTitle")}</p>
        <p className="mt-1 text-sm">{t("sent")}</p>
      </div>
    );
  }

  return (
    <form action={action} className="space-y-4">
      <Script src="https://challenges.cloudflare.com/turnstile/v0/api.js" strategy="afterInteractive" />
      {state.status === "error" && <p role="alert" className="text-sm text-red-600">{t(`error.${state.error}`)}</p>}
      <label className="block space-y-1">
        <span className="text-sm">{t("firstName")}</span>
        <input className="input" name="firstName" autoComplete="given-name" required maxLength={255} />
      </label>
      <label className="block space-y-1">
        <span className="text-sm">{t("lastName")}</span>
        <input className="input" name="lastName" autoComplete="family-name" required maxLength={255} />
      </label>
      <label className="block space-y-1">
        <span className="text-sm">{t("email")}</span>
        <input className="input" name="email" type="email" autoComplete="email" required maxLength={255} />
      </label>
      <label className="block space-y-1">
        <span className="text-sm">{t("message")}</span>
        <textarea className="input" name="message" rows={4} maxLength={500} placeholder={t("messageHint")} />
      </label>
      <div className="cf-turnstile" data-sitekey={siteKey} />
      <button className="button" type="submit" disabled={pending}>{t("submit")}</button>
    </form>
  );
}
