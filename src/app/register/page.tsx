import { getTranslations } from "next-intl/server";
import { RegisterForm } from "./register-form";

export async function generateMetadata() {
  return { title: (await getTranslations("register"))("title") };
}

export default async function RegisterPage() {
  const t = await getTranslations("register");

  return (
    <div className="mx-auto max-w-md space-y-4">
      <h1 className="text-2xl font-semibold">{t("title")}</h1>
      <p className="text-sm text-zinc-600 dark:text-zinc-400">{t("intro")}</p>
      <RegisterForm siteKey={process.env.TURNSTILE_SITE_KEY ?? ""} />
    </div>
  );
}
