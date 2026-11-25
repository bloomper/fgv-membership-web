import { getTranslations } from "next-intl/server";
import { VerifyForm } from "./verify-form";

export default async function VerifyPage({ searchParams }: { searchParams: Promise<{ token?: string }> }) {
  const t = await getTranslations("verify");
  const { token } = await searchParams;

  return (
    <div className="mx-auto max-w-md space-y-4">
      <h1 className="text-2xl font-semibold">{t("title")}</h1>
      {token ? <VerifyForm token={token} /> : <p role="alert">{t("invalid")}</p>}
    </div>
  );
}
