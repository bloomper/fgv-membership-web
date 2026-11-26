import { getFormatter, getLocale, getTranslations } from "next-intl/server";
import Link from "next/link";
import { requireRole } from "@/lib/guard";
import { hasRole } from "@/lib/roles";
import { memberDetail } from "@/lib/board";
import { feeLevels } from "@/lib/payment";
import { LinkForm, RecordForm, WaiverForm } from "./forms";

export default async function MemberPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const viewer = await requireRole("BOARD", `/board/members/${id}`);
  const t = await getTranslations("member");
  const tm = await getTranslations("members");
  const format = await getFormatter();
  const locale = await getLocale();
  const [detail, fees] = await Promise.all([memberDetail(viewer.accessToken, id), feeLevels(viewer.accessToken)]);
  const spexregister = process.env.SPEXREGISTER_WEB_URL?.trim().replace(/\/+$/, "");
  const options = fees.map((fee) => ({ id: fee.id, label: `${locale === "sv" ? fee.nameSv : fee.nameEn}${fee.lifetime ? ` (${t("forLife")})` : ` ${fee.year}`}: ${fee.amount} kr` }));
  const today = new Date().toISOString().slice(0, 10);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">{detail.spexare.firstName} {detail.spexare.lastName}</h1>
      <p className="text-sm">
        {detail.spexare.email}{detail.optedOut && ` · ${tm("optedOut")}`}
        {spexregister && <> · <a className="underline" href={`${spexregister}/spexare/${id}`} target="_blank" rel="noopener noreferrer">{t("inSpexregister")}</a></>}
      </p>

      <section className="space-y-1">
        <h2 className="font-semibold">{t("memberships")}</h2>
        {detail.memberships.length === 0 ? <p>{t("none")}</p> : (
          <ul>{detail.memberships.map((m) => (
            <li key={m.id}>{m.lifetime ? tm("lifetimeFrom", { year: m.year }) : m.year} – {tm(`statuses.${m.status}`)}{m.how ? `, ${tm(`hows.${m.how}`)}` : ""}{m.note ? ` (${m.note})` : ""}</li>
          ))}</ul>
        )}
      </section>

      <section className="space-y-1">
        <h2 className="font-semibold">{t("requests")}</h2>
        {detail.requests.length === 0 ? <p>{t("none")}</p> : (
          <ul>{detail.requests.map((r) => (
            <li key={r.id}><span className="font-mono">{r.reference}</span> – {format.number(r.amount)} kr ({t("paid", { paid: r.paid })}) – {t(`requestStatus.${r.status}`)} – {r.memberships.map((m) => m.year).join(", ")}</li>
          ))}</ul>
        )}
      </section>

      <section className="space-y-1">
        <h2 className="font-semibold">{t("emails")}</h2>
        {detail.emails.length === 0 ? <p>{t("none")}</p> : (
          <ul>{detail.emails.map((e) => <li key={e.sentAt}>{e.sentAt.slice(0, 10)} – {t(`emailKinds.${e.kind}`)}</li>)}</ul>
        )}
      </section>

      <section className="space-y-2">
        <h2 className="font-semibold">{t("waiver")}</h2>
        <p className="text-sm">{t("waiverIntro")}</p>
        <WaiverForm spexareId={id} year={new Date().getFullYear()} labels={{ year: t("year"), lifetime: t("lifetime"), note: t("note"), submit: t("grant") }} />
      </section>

      <section className="space-y-2">
        <h2 className="font-semibold">{t("sendLink")}</h2>
        <p className="text-sm">{t("sendLinkIntro")}</p>
        <LinkForm spexareId={id} options={options} labels={{ submit: t("send"), sent: t("sent"), notSent: t("notSent") }} />
      </section>

      {hasRole(viewer.roles, "TREASURER") && (
        <section className="space-y-2">
          <h2 className="font-semibold">{t("record")}</h2>
          <p className="text-sm">{t("recordIntro")}</p>
          <RecordForm spexareId={id} options={options} today={today}
                      labels={{ date: t("date"), amount: t("amount"), how: t("how"), note: t("note"), submit: t("recordSubmit"), hows: { SWISH: "Swish", BANK_TRANSFER: tm("hows.BANK_TRANSFER"), CASH: tm("hows.CASH") } }} />
        </section>
      )}
      <p><Link className="underline" href="/board/members">{t("back")}</Link></p>
    </div>
  );
}
