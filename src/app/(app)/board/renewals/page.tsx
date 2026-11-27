import { getLocale, getTranslations } from "next-intl/server";
import { Button } from "@bloomper/fgv-web-ui/ui/button";
import { Input } from "@bloomper/fgv-web-ui/ui/input";
import { NativeSelect, NativeSelectOption } from "@bloomper/fgv-web-ui/ui/native-select";
import { RenewalForm } from "@/components/members/renewal-form.client";
import { getFeeLevels } from "@/lib/membership/membership.server";
import { getRenewalPreview } from "@/lib/members/members.server";
import { formatAmount } from "@/utils/format";
import { Policies } from "@/utils/policy.server";
import { withPolicyPage } from "@/utils/route.server";
import { Page, PageHeader } from "@bloomper/fgv-web-ui/shell/page-header";

/** Who a renewal reminder for the year would go to, and a way to send it. */
export default async function RenewalsPage({
  searchParams,
}: {
  searchParams: Promise<{ year?: string; fee?: string }>;
}) {
  return withPolicyPage(Policies.board.requireBoard, async () => {
    const t = await getTranslations("Renewals");
    const locale = await getLocale();
    const { year: yearParam, fee: feeParam } = await searchParams;
    const year = Number(yearParam) || new Date().getFullYear() + 1;
    const fees = (await getFeeLevels()).filter((fee) => !fee.lifetime && fee.year === year);
    const fee = fees.find((candidate) => candidate.id === feeParam) ?? fees[0];
    const preview = fee ? await getRenewalPreview(year, fee.id) : null;

    return (
      <Page>
        <PageHeader
          title={t("title")}
          description={t("intro")}
        />
        <form
          className="flex flex-wrap items-end gap-3"
          action="/board/renewals"
        >
          <label className="space-y-1 text-sm">
            {t("year")}
            <Input
              className="w-24"
              type="number"
              name="year"
              defaultValue={year}
            />
          </label>
          {fee && (
            <label className="space-y-1 text-sm">
              {t("fee")}
              <NativeSelect
                name="fee"
                defaultValue={fee.id}
              >
                {fees.map((f) => (
                  <NativeSelectOption
                    key={f.id}
                    value={f.id}
                  >
                    {locale === "sv" ? f.nameSv : f.nameEn}: {formatAmount(f.amount)}
                  </NativeSelectOption>
                ))}
              </NativeSelect>
            </label>
          )}
          <Button
            type="submit"
            variant="outline"
          >
            {t("show")}
          </Button>
        </form>
        {!fee ? (
          <p>{t("noFee", { year })}</p>
        ) : (
          preview && (
            <div className="space-y-3">
              <p className="font-semibold">{t("recipients", { count: preview.count })}</p>
              {preview.sample.length > 0 && (
                <p className="text-sm">
                  {t("sample")}: {preview.sample.join(", ")}
                  {preview.count > preview.sample.length ? "…" : ""}
                </p>
              )}
              <div className="max-w-prose rounded-md border p-3 text-sm">
                <p className="font-semibold">{preview.subject}</p>
                <p className="whitespace-pre-wrap">{preview.text}</p>
              </div>
              {preview.count > 0 && (
                <RenewalForm
                  year={year}
                  feeLevelId={fee.id}
                  count={preview.count}
                />
              )}
            </div>
          )
        )}
      </Page>
    );
  });
}
