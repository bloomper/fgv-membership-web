import Link from "next/link";
import {getTranslations} from "next-intl/server";
import {Badge} from "@/components/ui/badge";
import {Card, CardContent} from "@/components/ui/card";
import {DataEmpty} from "@/components/data-empty";
import {RecordPaymentForm} from "@/components/treasurer/record-payment-form.client";
import {UndoButton} from "@/components/treasurer/undo-button.client";
import {getPaymentsThisYear, getWaitingRequests} from "@/lib/payments/payments.server";
import {formatAmount, formatDate} from "@/utils/format";
import {Policies} from "@/utils/policy.server";
import {withPolicyPage} from "@/utils/route.server";

/** Requests that wait for money, and the payments recorded this year, which can be undone until the year ends. */
export default async function PaymentsPage() {
    return withPolicyPage(Policies.treasurer.requireTreasurer, async () => {
        const t = await getTranslations("Treasurer");
        const [requests, done] = await Promise.all([getWaitingRequests(), getPaymentsThisYear()]);
        const today = new Date().toISOString().slice(0, 10);

        return (
            <div className="flex flex-1 flex-col gap-6 p-4 md:p-8">
                <h1 className="text-2xl font-bold tracking-tight">{t("title")}</h1>
                <p className="max-w-prose text-sm text-muted-foreground">{t("intro")}</p>
                <p className="text-sm">
                    <a className="underline underline-offset-4" href={`/board/export/payments?year=${new Date().getFullYear()}`}>{t("exportPayments")}</a>
                </p>
                {requests.length === 0 ? <DataEmpty title={t("none")} description=""/> : (
                    <ul className="space-y-4">
                        {requests.map(request => (
                            <li key={request.id}>
                                <Card>
                                    <CardContent className="space-y-3">
                                        <p>
                                            <span className="font-mono font-semibold">{request.reference}</span> – {request.spexareName ?? "?"} –{" "}
                                            {request.memberships.map(item => (item.lifetime ? t("lifeFrom", {year: item.year}) : String(item.year))).join(", ")}
                                            {" – "}<span className="font-semibold">{formatAmount(request.amount)}</span>
                                            {request.paid > 0 && <> ({t("paidSoFar", {paid: request.paid, left: request.amount - request.paid})})</>}
                                        </p>
                                        {request.family && (
                                            <p className="text-sm">
                                                {t("family")}{request.familyNote ? `: ${request.familyNote}` : ""}
                                                {request.familyIncomplete && <> – <strong>{t("familyIncomplete")}</strong></>}
                                                {" – "}<Link className="underline underline-offset-4" href={`/board/requests/${request.id}/family`}>{t("attachFamily")}</Link>
                                            </p>
                                        )}
                                        <p className="text-sm">
                                            <Badge variant="secondary">{t(`status.${request.status}`)}</Badge>
                                            {request.status === "REPORTED" && request.paidBy ? ` ${t("paidBy", {name: request.paidBy})}` : ""}
                                        </p>
                                        <RecordPaymentForm requestId={request.id} amount={request.amount - request.paid} today={today}/>
                                    </CardContent>
                                </Card>
                            </li>
                        ))}
                    </ul>
                )}
                <section className="space-y-2">
                    <h2 className="text-lg font-semibold">{t("recorded")}</h2>
                    <p className="text-sm text-muted-foreground">{t("undoIntro")}</p>
                    {done.length === 0 ? <p className="text-sm text-muted-foreground">{t("noneRecorded")}</p> : (
                        <ul className="space-y-1">
                            {done.map(payment => (
                                <li key={payment.id} className="flex flex-wrap items-center gap-x-2 text-sm">
                                    {formatDate(payment.paidOn)} – <span className="font-mono">{payment.reference}</span> – {payment.spexareName ?? "?"} – {formatAmount(payment.amount)}
                                    {payment.transaction ? ` (${t("fromBank")})` : ""}
                                    <UndoButton id={payment.id}/>
                                </li>
                            ))}
                        </ul>
                    )}
                </section>
            </div>
        );
    });
}
