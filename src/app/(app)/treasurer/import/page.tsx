import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { ImportForm } from "@/components/treasurer/import-form.client";
import { getBankFormats } from "@/lib/bank/bank.server";
import { Policies } from "@/utils/policy.server";
import { withPolicyPage } from "@/utils/route.server";
import { Page, PageHeader } from "@bloomper/fgv-web-ui/shell/page-header";

/** Upload the account's transactions as a CSV file from the bank. */
export default async function ImportPage() {
  return withPolicyPage(Policies.treasurer.requireTreasurer, async () => {
    const t = await getTranslations("Bank");
    const formats = await getBankFormats();

    return (
      <Page>
        <PageHeader
          title={t("importTitle")}
          description={t("importIntro")}
        />
        {formats.length === 0 ? (
          <p>{t("noFormats")}</p>
        ) : (
          <ImportForm formats={formats.map((format) => ({ id: format.id, name: format.name }))} />
        )}
        <p>
          <Link
            className="text-link hover:text-link/80"
            href="/treasurer/transactions"
          >
            {t("toTransactions")}
          </Link>
        </p>
      </Page>
    );
  });
}
