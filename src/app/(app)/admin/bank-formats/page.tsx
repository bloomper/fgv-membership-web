import { getTranslations } from "next-intl/server";
import { BankFormatForm } from "@/components/admin/bank-format-form.client";
import { getBankFormats } from "@/lib/bank/bank.server";
import { Policies } from "@/utils/policy.server";
import { withPolicyPage } from "@/utils/route.server";
import { Page, PageHeader } from "@bloomper/fgv-web-ui/shell/page-header";

/** The layout of each bank's CSV file, described once. */
export default async function BankFormatsPage() {
  return withPolicyPage(Policies.admin.requireAdmin, async () => {
    const t = await getTranslations("Formats");
    const formats = await getBankFormats();

    return (
      <Page>
        <PageHeader
          title={t("title")}
          description={t("intro")}
        />
        <ul className="space-y-6">
          {formats.map((format) => (
            <li key={format.id}>
              <BankFormatForm format={{ ...format, payerColumn: format.payerColumn ?? null }} />
            </li>
          ))}
        </ul>
        <section className="space-y-2">
          <h2 className="text-lg font-semibold">{t("add")}</h2>
          <BankFormatForm format={null} />
        </section>
      </Page>
    );
  });
}
