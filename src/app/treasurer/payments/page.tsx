import { getFormatter, getTranslations } from "next-intl/server";
import { requireRole } from "@/lib/guard";
import { waitingRequests } from "@/lib/payment";
import { RecordForm } from "./record-form";

export default async function PaymentsPage() {
  const viewer = await requireRole("TREASURER", "/treasurer/payments");
  const t = await getTranslations("treasurer");
  const format = await getFormatter();
  const requests = await waitingRequests(viewer.accessToken);
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
              </p>
              <p className="text-sm">
                {t(`status.${request.status}`)}
                {request.status === "REPORTED" && request.paidBy ? ` (${t("paidBy", { name: request.paidBy })})` : ""}
              </p>
              <RecordForm requestId={request.id} amount={request.amount} today={today}
                          labels={{ date: t("date"), amount: t("amount"), how: t("how"), note: t("note"), record: t("record"), cancel: t("cancel"),
                            confirmCancel: t("confirmCancel"), hows: { SWISH: "Swish", BANK_TRANSFER: t("bank"), CASH: t("cash") } }} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
