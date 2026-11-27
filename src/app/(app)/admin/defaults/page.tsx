import { getTranslations } from "next-intl/server";
import { DefaultForm } from "@/components/admin/default-form.client";
import { ACCESS_PROFILES, getDefaultAccess } from "@/lib/defaults/defaults.server";
import { Policies } from "@/utils/policy.server";
import { withPolicyPage } from "@/utils/route.server";
import { Page, PageHeader } from "@bloomper/fgv-web-ui/shell/page-header";

/** The access a new account gets when it is made from a payment elsewhere. */
export default async function DefaultsPage() {
  return withPolicyPage(Policies.admin.requireAdmin, async () => {
    const t = await getTranslations("Defaults");
    const sets = await Promise.all(
      ACCESS_PROFILES.map(async (profile) => ({ profile, entries: await getDefaultAccess(profile) }))
    );

    return (
      <Page variant="content">
        <PageHeader
          title={t("title")}
          description={t("intro")}
        />
        {sets.map(({ profile, entries }) => (
          <section
            key={profile}
            className="space-y-2"
          >
            <h2 className="text-lg font-semibold">{t(`profiles.${profile}`)}</h2>
            <p className="text-muted-foreground text-sm">{t(`profileHints.${profile}`)}</p>
            <ul className="space-y-3">
              {entries.map((entry) => (
                <li key={entry.clientId}>
                  <DefaultForm
                    profile={profile as "MEMBER" | "SUPPORT"}
                    clientId={entry.clientId}
                    name={entry.name}
                    ladder={entry.ladder}
                    role={entry.role ?? null}
                  />
                </li>
              ))}
            </ul>
          </section>
        ))}
      </Page>
    );
  });
}
