import { getFormatter, getTranslations } from "next-intl/server";
import { requireRole } from "@/lib/guard";
import { paymentsThisYear, waitingRequests } from "@/lib/payment";
import { UndoButton } from "./undo-button";
import { RecordForm } from "./record-form";

export default async function PaymentsPage() {
  const viewer = await requireRole("TREASURER", "/treasurer/payments");
  const t = await getTranslations("treasurer");
  const format = await getFormatter();
  const [requests, done] = await Promise.all([waitingRequests(viewer.accessToken), paymentsThisYear(viewer.accessToken)]);
  const today = new Date().toISOString().slice(0, 10);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">{t("title")}</h1>
      <p className="text-sm">{t("intro")}</p>
      {requests.length === 0 ? <p>{t("none")}</p> : (
        <ul className="space-y-4">
          {requests.map((request) => (
            <li key={request.id} className="space-y-2 rounded border border-zinc-200 p-3 dark:border-zinc-800">
              <p>
                <span className="font-mono font-semibold">{request.reference}</span> – {request.spexareName ?? "?"} –{" "}
                {request.memberships.map((item) => (item.lifetime ? t("lifeFrom", { year: item.year }) : String(item.year))).join(", ")}
                {" – "}<span className="font-semibold">{format.number(request.amount)} kr</span>
                {request.paid > 0 && <> ({t("paidSoFar", { paid: request.paid, left: request.amount - request.paid })})</>}
              </p>
              <p className="text-sm">
                {t(`status.${request.status}`)}
                {request.status === "REPORTED" && request.paidBy ? ` (${t("paidBy", { name: request.paidBy })})` : ""}
              </p>
              <RecordForm requestId={request.id} amount={request.amount - request.paid} today={today}
                          labels={{ date: t("date"), amount: t("amount"), how: t("how"), note: t("note"), record: t("record"), cancel: t("cancel"),
                            confirmCancel: t("confirmCancel"), hows: { SWISH: "Swish", BANK_TRANSFER: t("bank"), CASH: t("cash") } }} />
            </li>
          ))}
        </ul>
      )}
      <section className="space-y-2">
        <h2 className="font-semibold">{t("recorded")}</h2>
        <p className="text-sm">{t("undoIntro")}</p>
        {done.length === 0 ? <p>{t("noneRecorded")}</p> : (
          <ul className="space-y-1">
            {done.map((payment) => (
              <li key={payment.id} className="flex flex-wrap items-center gap-2 text-sm">
                {payment.paidOn} – <span className="font-mono">{payment.reference}</span> – {payment.spexareName ?? "?"} – {format.number(payment.amount)} kr
                {payment.transaction ? ` (${t("fromBank")})` : ""}
                <UndoButton id={payment.id} labels={{ undo: t("undo"), confirm: t("confirmUndo") }} />
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
