import { getTranslations } from "next-intl/server";
import { requireRole } from "@/lib/guard";
import { settings } from "@/lib/payment";
import { SettingsForm } from "./settings-form";

export default async function SettingsPage() {
  const viewer = await requireRole("ADMIN", "/admin/settings");
  const t = await getTranslations("settings");
  const current = await settings(viewer.accessToken);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">{t("title")}</h1>
      <p className="text-sm">{t("intro")}</p>
      <SettingsForm current={{ ...current, recipients: current.recipients.join("\n") }}
                    labels={{ swish: t("swish"), bankgiro: t("bankgiro"), bank: t("bank"), payee: t("payee"), days: t("days"), recipients: t("recipients"), recipientsHint: t("recipientsHint"), save: t("save"), saved: t("saved") }} />
    </div>
  );
}
