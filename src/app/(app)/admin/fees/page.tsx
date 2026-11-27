import { getTranslations } from "next-intl/server";
import { FeeForm } from "@/components/admin/fee-form.client";
import { getAllFeeLevels } from "@/lib/fees/fees.server";
import { Policies } from "@/utils/policy.server";
import { withPolicyPage } from "@/utils/route.server";
import { Page, PageHeader } from "@bloomper/fgv-web-ui/shell/page-header";

/** What a membership costs for a year, and the one-time fee for a life membership. */
export default async function FeesPage() {
  return withPolicyPage(Policies.admin.requireAdmin, async () => {
    const t = await getTranslations("Fees");
    const fees = await getAllFeeLevels();

    return (
      <Page>
        <PageHeader
          title={t("title")}
          description={t("intro")}
        />
        <ul className="space-y-4">
          {fees.map((fee) => (
            <li
              key={fee.id}
              className={fee.retired ? "opacity-60" : ""}
            >
              <FeeForm
                fee={{
                  id: fee.id,
                  year: fee.year ?? null,
                  kind: fee.kind,
                  nameSv: fee.nameSv,
                  nameEn: fee.nameEn,
                  amount: fee.amount,
                  retired: fee.retired,
                }}
              />
            </li>
          ))}
        </ul>
        <section className="space-y-2">
          <h2 className="text-lg font-semibold">{t("add")}</h2>
          <FeeForm fee={null} />
        </section>
      </Page>
    );
  });
}
