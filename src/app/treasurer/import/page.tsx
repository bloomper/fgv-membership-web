import { getTranslations } from "next-intl/server";
import Link from "next/link";
import { requireRole } from "@/lib/guard";
import { bankFormats } from "@/lib/payment";
import { ImportForm } from "./import-form";

export default async function ImportPage() {
  const viewer = await requireRole("TREASURER", "/treasurer/import");
  const t = await getTranslations("bank");
  const formats = await bankFormats(viewer.accessToken);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">{t("importTitle")}</h1>
      <p className="text-sm">{t("importIntro")}</p>
      {formats.length === 0 ? <p>{t("noFormats")}</p> : (
        <ImportForm formats={formats.map((format) => ({ id: format.id, name: format.name }))}
                    labels={{ format: t("format"), file: t("file"), submit: t("upload"), read: t("read"), added: t("added"), duplicates: t("duplicates"),
                      outgoing: t("outgoing"), matched: t("matchedAtOnce"), errors: t("errors") }} />
      )}
      <p><Link className="underline" href="/treasurer/transactions">{t("toTransactions")}</Link></p>
    </div>
  );
}
