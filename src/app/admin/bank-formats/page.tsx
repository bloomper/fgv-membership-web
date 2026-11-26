import { getTranslations } from "next-intl/server";
import { requireRole } from "@/lib/guard";
import { bankFormats } from "@/lib/payment";
import { DeleteFormat, FormatForm } from "./format-form";

export default async function BankFormatsPage() {
  const viewer = await requireRole("ADMIN", "/admin/bank-formats");
  const t = await getTranslations("formats");
  const formats = await bankFormats(viewer.accessToken);
  const labels = { name: t("name"), charset: t("charset"), delimiter: t("delimiter"), headerLines: t("headerLines"), dateColumn: t("dateColumn"),
    amountColumn: t("amountColumn"), textColumn: t("textColumn"), payerColumn: t("payerColumn"), dateFormat: t("dateFormat"), decimalComma: t("decimalComma"), save: t("save") };

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">{t("title")}</h1>
      <p className="text-sm">{t("intro")}</p>
      <ul className="space-y-4">
        {formats.map((format) => (
          <li key={format.id} className="space-y-1">
            <FormatForm format={format} labels={labels} />
            <DeleteFormat id={format.id} labels={{ delete: t("delete"), confirm: t("confirmDelete") }} />
          </li>
        ))}
      </ul>
      <section className="space-y-2">
        <h2 className="font-semibold">{t("add")}</h2>
        <FormatForm format={null} labels={labels} />
      </section>
    </div>
  );
}
