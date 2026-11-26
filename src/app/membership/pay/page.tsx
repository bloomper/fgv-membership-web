import { getLocale, getTranslations } from "next-intl/server";
import { requireRole } from "@/lib/guard";
import { feeLevels } from "@/lib/payment";
import { PayForm } from "./pay-form";

export default async function PayPage() {
  const viewer = await requireRole("USER", "/membership/pay");
  const t = await getTranslations("pay");
  const locale = await getLocale();
  const fees = await feeLevels(viewer.accessToken);
  const options = fees.map((fee) => ({
    id: fee.id,
    group: fee.lifetime ? "life" : String(fee.year),
    label: `${locale === "sv" ? fee.nameSv : fee.nameEn}${fee.lifetime ? ` (${t("forLife")})` : fee.year ? ` ${fee.year}` : ""}`,
    amount: fee.amount,
  }));

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">{t("title")}</h1>
      {options.length === 0 ? <p>{t("noFees")}</p> : (
        <>
          <p>{t("intro")}</p>
          <PayForm options={options} labels={{ submit: t("submit"), total: t("total"), life: t("lifeGroup") }} />
        </>
      )}
    </div>
  );
}
