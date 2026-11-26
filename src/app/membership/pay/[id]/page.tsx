import { getFormatter, getTranslations } from "next-intl/server";
import Link from "next/link";
import { requireRole } from "@/lib/guard";
import { paymentRequest } from "@/lib/payment";
import { ReportForm } from "./report-form";

export default async function PaymentPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const viewer = await requireRole("USER", `/membership/pay/${id}`);
  const t = await getTranslations("pay");
  const format = await getFormatter();
  const request = await paymentRequest(viewer.accessToken, id);
  const open = request.status === "OPEN" || request.status === "REPORTED";

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">{t("payTitle")}</h1>
      <p>{request.memberships.map((item) => (item.lifetime ? t("lifeFrom", { year: item.year }) : String(item.year))).join(", ")}</p>
      {request.family && (
        <p className="text-sm">{request.familyIncomplete ? t("familyPending") : t("familyCount", { count: new Set(request.memberships.map((item) => item.spexareId)).size })}</p>
      )}
      {request.status === "MATCHED" && <p role="status" className="font-semibold">{t("confirmed")}</p>}
      {request.status === "CANCELLED" && <p role="status">{t("cancelled")}</p>}
      {open && (
        <>
          <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1">
            <dt>{t("amount")}</dt><dd className="font-semibold">{format.number(request.amount)} kr</dd>
            <dt>{t("reference")}</dt><dd className="font-mono font-semibold">{request.reference}</dd>
            {request.payee.swishNumber && <><dt>Swish</dt><dd>{request.payee.swishNumber}</dd></>}
            {request.payee.bankAccount && <><dt>{t("bankAccount")}</dt><dd>{request.payee.bankAccount}</dd></>}
          </dl>
          <p className="text-sm">{t("keepReference")}</p>
          {request.swishLink && (
            <p className="md:hidden"><a className="button" href={request.swishLink}>{t("openSwish")}</a></p>
          )}
          {request.qr && (
            // eslint-disable-next-line @next/next/no-img-element
            <img className="hidden h-52 w-52 md:block" src={request.qr} alt={t("qrAlt")} />
          )}
          {request.status === "REPORTED" ? (
            <p role="status" className="font-semibold">{t("waitingForConfirmation")}</p>
          ) : (
            <ReportForm id={request.id} labels={{ paidBy: t("paidBy"), paidByHint: t("paidByHint"), submit: t("iHavePaid"), done: t("reported") }} />
          )}
        </>
      )}
      <p><Link className="underline" href="/membership">{t("back")}</Link></p>
    </div>
  );
}
