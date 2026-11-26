import { getTranslations } from "next-intl/server";
import { requireRole } from "@/lib/guard";
import { defaultAccess } from "@/lib/payment";
import { DefaultForm } from "./default-form";

export default async function DefaultsPage() {
  const viewer = await requireRole("ADMIN", "/admin/defaults");
  const t = await getTranslations("defaults");
  const entries = await defaultAccess(viewer.accessToken);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">{t("title")}</h1>
      <p className="text-sm">{t("intro")}</p>
      <ul className="space-y-2">
        {entries.map((entry) => (
          <li key={entry.clientId} className="flex flex-wrap items-center gap-3">
            <span className="w-48 font-medium">{entry.name}</span>
            <DefaultForm entry={entry} labels={{ none: t("none"), save: t("save") }} />
          </li>
        ))}
      </ul>
    </div>
  );
}
