import Link from "next/link";
import {getTranslations} from "next-intl/server";
import {Card, CardContent} from "@/components/ui/card";
import {DataEmpty} from "@/components/data-empty";
import {TransactionForm} from "@/components/treasurer/transaction-form.client";
import {getTransactionSuggestions, getUnmatchedTransactions} from "@/lib/bank/bank.server";
import {getWaitingRequests} from "@/lib/payments/payments.server";
import {formatAmount, formatDate} from "@/utils/format";
import {Policies} from "@/utils/policy.server";
import {withPolicyPage} from "@/utils/route.server";

/** Incoming bank transactions that nothing has been matched to. */
export default async function TransactionsPage() {
    return withPolicyPage(Policies.treasurer.requireTreasurer, async () => {
        const t = await getTranslations("Bank");
        const [transactions, waiting] = await Promise.all([getUnmatchedTransactions(), getWaitingRequests()]);
        const suggestions = await Promise.all(transactions.map(transaction => getTransactionSuggestions(transaction.id)));
        const options = waiting.map(request => ({
            id: request.id,
            label: `${request.reference} – ${request.spexareName ?? "?"} – ${formatAmount(request.amount - request.paid)}${request.status === "REPORTED" ? ` (${t("reported")})` : ""}`,
        }));
        const reported = waiting.filter(request => request.status === "REPORTED");

        return (
            <div className="flex flex-1 flex-col gap-6 p-4 md:p-8">
                <h1 className="text-2xl font-bold tracking-tight">{t("transactionsTitle")}</h1>
                <p className="max-w-prose text-sm text-muted-foreground">
                    {t("transactionsIntro")} <Link className="underline underline-offset-4" href="/treasurer/import">{t("importTitle")}</Link>
                </p>
                {transactions.length === 0 ? <DataEmpty title={t("noTransactions")} description=""/> : (
                    <ul className="space-y-4">
                        {transactions.map((transaction, index) => (
                            <li key={transaction.id}>
                                <Card>
                                    <CardContent className="space-y-3">
                                        <p>
                                            {formatDate(transaction.bookedOn)} – <span className="font-semibold">{formatAmount(transaction.amount)}</span> – {transaction.payer ?? ""}
                                            {transaction.text ? ` – ${transaction.text}` : ""}
                                        </p>
                                        <TransactionForm id={transaction.id} options={options}
                                                         suggested={suggestions[index].map(s => ({id: s.requestId, why: s.why}))}/>
                                    </CardContent>
                                </Card>
                            </li>
                        ))}
                    </ul>
                )}
                <section className="space-y-2">
                    <h2 className="text-lg font-semibold">{t("reportedWithoutMatch")}</h2>
                    {reported.length === 0 ? <p className="text-sm text-muted-foreground">{t("none")}</p> : (
                        <ul className="space-y-1">
                            {reported.map(request => (
                                <li key={request.id}>{request.reference} – {request.spexareName ?? "?"} – {formatAmount(request.amount)}{request.paidBy ? ` (${request.paidBy})` : ""}</li>
                            ))}
                        </ul>
                    )}
                </section>
            </div>
        );
    });
}
