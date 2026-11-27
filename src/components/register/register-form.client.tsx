"use client";

import {useId, useState, useTransition} from "react";
import Script from "next/script";
import {useTranslations} from "next-intl";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {Button} from "@bloomper/fgv-web-ui/ui/button";
import {Input} from "@bloomper/fgv-web-ui/ui/input";
import {Label} from "@bloomper/fgv-web-ui/ui/label";
import {Textarea} from "@bloomper/fgv-web-ui/ui/textarea";
import {FormError} from "@/components/form-error";
import {type RegisterResult, registerAction} from "@/app/(public)/register/actions.server";
import {MAX_NAME, MAX_REGISTRATION_MESSAGE, type RegisterValues, registerSchema} from "@/lib/register/schema";

declare global {
    interface Window {
        turnstile?: { reset: () => void };
    }
}

/** Name, address and a message to the administrators, behind a Cloudflare Turnstile challenge. */
export function RegisterForm({siteKey}: { siteKey: string }) {
    const t = useTranslations("Register");
    const id = useId();
    const [pending, startTransition] = useTransition();
    const [result, setResult] = useState<RegisterResult | null>(null);
    const form = useForm<RegisterValues>({resolver: zodResolver(registerSchema), defaultValues: {firstName: "", lastName: "", email: "", message: ""}});
    const {errors} = form.formState;

    if (result === "sent") {
        return (
            <div role="status" className="rounded-lg border p-4">
                <p className="font-medium">{t("sentTitle")}</p>
                <p className="mt-1 text-sm">{t("sent")}</p>
            </div>
        );
    }

    return (
        <form className="space-y-4"
              onSubmit={form.handleSubmit((values, event) => startTransition(async () => {
                  const token = new FormData(event?.target as HTMLFormElement).get("cf-turnstile-response");
                  const outcome = await registerAction(values, typeof token === "string" ? token : "");

                  setResult(outcome);
                  // A Turnstile response works once: ask for a new one after every try
                  if (outcome !== "sent") {
                      window.turnstile?.reset();
                  }
              }))}>
            <Script src="https://challenges.cloudflare.com/turnstile/v0/api.js" strategy="afterInteractive"/>
            {result && <p role="alert" className="text-sm text-destructive">{t(`error.${result}`)}</p>}
            <div className="space-y-2">
                <Label htmlFor={`${id}-first`}>{t("firstName")}</Label>
                <Input id={`${id}-first`} autoComplete="given-name" maxLength={MAX_NAME} {...form.register("firstName")}/>
                <FormError message={errors.firstName?.message}/>
            </div>
            <div className="space-y-2">
                <Label htmlFor={`${id}-last`}>{t("lastName")}</Label>
                <Input id={`${id}-last`} autoComplete="family-name" maxLength={MAX_NAME} {...form.register("lastName")}/>
                <FormError message={errors.lastName?.message}/>
            </div>
            <div className="space-y-2">
                <Label htmlFor={`${id}-email`}>{t("email")}</Label>
                <Input id={`${id}-email`} type="email" autoComplete="email" maxLength={MAX_NAME} {...form.register("email")}/>
                <FormError message={errors.email?.message}/>
            </div>
            <div className="space-y-2">
                <Label htmlFor={`${id}-message`}>{t("message")}</Label>
                <Textarea id={`${id}-message`} rows={4} maxLength={MAX_REGISTRATION_MESSAGE} placeholder={t("messageHint")} {...form.register("message")}/>
                <FormError message={errors.message?.message}/>
            </div>
            <div className="cf-turnstile" data-sitekey={siteKey}/>
            <Button type="submit" disabled={pending}>{t("submit")}</Button>
        </form>
    );
}
