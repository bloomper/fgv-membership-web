import { getTranslations } from "next-intl/server";
import { requireRole } from "@/lib/guard";
import { defaultAccess, type AccessProfile } from "@/lib/payment";
import { DefaultForm } from "./default-form";

const PROFILES: AccessProfile[] = ["MEMBER", "SUPPORT"];

export default async function DefaultsPage() {
  const viewer = await requireRole("ADMIN", "/admin/defaults");
  const t = await getTranslations("defaults");
  const sets = await Promise.all(PROFILES.map(async (profile) => ({ profile, entries: await defaultAccess(viewer.accessToken, profile) })));

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">{t("title")}</h1>
      <p className="text-sm">{t("intro")}</p>
      {sets.map(({ profile, entries }) => (
        <section key={profile} className="space-y-2">
          <h2 className="font-semibold">{t(`profiles.${profile}`)}</h2>
          <p className="text-sm">{t(`profileHints.${profile}`)}</p>
          <ul className="space-y-2">
            {entries.map((entry) => (
              <li key={entry.clientId} className="flex flex-wrap items-center gap-3">
                <span className="w-48 font-medium">{entry.name}</span>
                <DefaultForm profile={profile} entry={entry} labels={{ none: t("none"), save: t("save") }} />
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
