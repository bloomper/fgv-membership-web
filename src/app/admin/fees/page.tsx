import { getTranslations } from "next-intl/server";
import { requireRole } from "@/lib/guard";
import { allFeeLevels } from "@/lib/payment";
import { FeeForm, RetireButton } from "./fee-form";

export default async function FeesPage() {
  const viewer = await requireRole("ADMIN", "/admin/fees");
  const t = await getTranslations("fees");
  const fees = await allFeeLevels(viewer.accessToken);
  const labels = { year: t("year"), lifetime: t("lifetime"), nameSv: t("nameSv"), nameEn: t("nameEn"), amount: t("amount"), save: t("save") };

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">{t("title")}</h1>
      <p className="text-sm">{t("intro")}</p>
      <ul className="space-y-3">
        {fees.map((fee) => (
          <li key={fee.id} className={fee.retired ? "opacity-60" : ""}>
            <FeeForm fee={fee} labels={labels} />
            <RetireButton id={fee.id} retired={fee.retired} labels={{ retire: t("retire"), restore: t("restore") }} />
          </li>
        ))}
      </ul>
      <section className="space-y-2">
        <h2 className="font-semibold">{t("add")}</h2>
        <FeeForm fee={null} labels={labels} />
      </section>
    </div>
  );
}
