import {connection} from "next/server";
import {getTranslations} from "next-intl/server";
import {RegisterForm} from "@/components/register/register-form.client";

/** Creates an account; Keycloak's Register link points here. */
export default async function RegisterPage() {
    await connection();

    const t = await getTranslations("Register");

    return (
        <div className="space-y-4">
            <h1 className="text-2xl font-bold tracking-tight">{t("title")}</h1>
            <p className="text-sm text-muted-foreground">{t("intro")}</p>
            <RegisterForm siteKey={process.env.TURNSTILE_SITE_KEY ?? ""}/>
        </div>
    );
}
