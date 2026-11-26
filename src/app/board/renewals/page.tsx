import { getLocale, getTranslations } from "next-intl/server";
import { requireRole } from "@/lib/guard";
import { renewalPreview } from "@/lib/board";
import { feeLevels } from "@/lib/payment";
import { RenewalForm } from "./renewal-form";

export default async function RenewalsPage({ searchParams }: { searchParams: Promise<{ year?: string; fee?: string }> }) {
  const viewer = await requireRole("BOARD", "/board/renewals");
  const t = await getTranslations("renewals");
  const locale = await getLocale();
  const { year: yearParam, fee: feeParam } = await searchParams;
  const year = Number(yearParam) || new Date().getFullYear() + 1;
  const fees = (await feeLevels(viewer.accessToken)).filter((fee) => !fee.lifetime && fee.year === year);
  const fee = fees.find((candidate) => candidate.id === feeParam) ?? fees[0];
  const preview = fee ? await renewalPreview(viewer.accessToken, year, fee.id) : null;

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">{t("title")}</h1>
      <p className="text-sm">{t("intro")}</p>
      <form className="flex flex-wrap items-end gap-2" action="/board/renewals">
        <label className="text-sm">{t("year")}<input className="input w-24" type="number" name="year" defaultValue={year} /></label>
        <button className="button-secondary" type="submit">{t("show")}</button>
      </form>
      {!fee ? <p>{t("noFee", { year })}</p> : preview && (
        <div className="space-y-3">
          <form className="flex items-end gap-2" action="/board/renewals">
            <input type="hidden" name="year" value={year} />
            <label className="text-sm">{t("fee")}
              <select className="input" name="fee" defaultValue={fee.id}>
                {fees.map((f) => <option key={f.id} value={f.id}>{locale === "sv" ? f.nameSv : f.nameEn}: {f.amount} kr</option>)}
              </select>
            </label>
            <button className="button-secondary" type="submit">{t("show")}</button>
          </form>
          <p className="font-semibold">{t("recipients", { count: preview.count })}</p>
          {preview.sample.length > 0 && <p className="text-sm">{t("sample")}: {preview.sample.join(", ")}{preview.count > preview.sample.length ? "…" : ""}</p>}
          <div className="rounded border border-zinc-200 p-3 text-sm dark:border-zinc-800">
            <p className="font-semibold">{preview.subject}</p>
            <p>{preview.text}</p>
          </div>
          {preview.count > 0 && <RenewalForm year={year} feeId={fee.id} labels={{ send: t("send"), confirm: t("confirm", { count: preview.count }), done: t.raw("done") as string }} />}
        </div>
      )}
    </div>
  );
}
