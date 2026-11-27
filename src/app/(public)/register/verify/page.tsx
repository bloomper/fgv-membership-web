import { getTranslations } from "next-intl/server";
import { VerifyForm } from "@/components/register/verify-form.client";

/** The link in the verification email. */
export default async function VerifyPage({ searchParams }: { searchParams: Promise<{ token?: string }> }) {
  const t = await getTranslations("Verify");
  const { token } = await searchParams;

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold tracking-tight">{t("title")}</h1>
      {token ? <VerifyForm token={token} /> : <p role="alert">{t("invalid")}</p>}
    </div>
  );
}
