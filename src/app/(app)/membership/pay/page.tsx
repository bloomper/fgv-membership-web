import { getLocale, getTranslations } from "next-intl/server";
import { PayForm } from "@/components/membership/pay-form.client";
import { getFeeLevels } from "@/lib/membership/membership.server";
import { Policies } from "@/utils/policy.server";
import { withPolicyPage } from "@/utils/route.server";
import { Page, PageHeader } from "@bloomper/fgv-web-ui/shell/page-header";

/** Pick the fees to pay: one for each year, or the life fee. */
export default async function PayPage() {
  return withPolicyPage(Policies.app.requireAccess, async () => {
    const t = await getTranslations("Pay");
    const locale = await getLocale();
    const fees = await getFeeLevels();
    const options = fees.map((fee) => ({
      id: fee.id,
      group: fee.lifetime ? "life" : String(fee.year),
      label: `${locale === "sv" ? fee.nameSv : fee.nameEn}${fee.lifetime ? ` (${t("forLife")})` : fee.year ? ` ${fee.year}` : ""}${fee.kind === "FAMILY" ? ` (${t("family")})` : fee.kind === "SUPPORT" ? ` (${t("support")})` : ""}`,
      amount: fee.amount,
      family: fee.kind === "FAMILY",
    }));

    return (
      <Page>
        <PageHeader title={t("title")} />
        {options.length === 0 ? (
          <p className="text-muted-foreground text-sm">{t("noFees")}</p>
        ) : (
          <>
            <p className="text-muted-foreground max-w-prose text-sm">{t("intro")}</p>
            <PayForm options={options} />
          </>
        )}
      </Page>
    );
  });
}
