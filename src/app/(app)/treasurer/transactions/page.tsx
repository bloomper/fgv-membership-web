import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { Card, CardContent } from "@bloomper/fgv-web-ui/ui/card";
import { DataEmpty } from "@bloomper/fgv-web-ui/shell/data-empty";
import { TransactionForm } from "@/components/treasurer/transaction-form.client";
import { getTransactionSuggestions, getUnmatchedTransactions } from "@/lib/bank/bank.server";
import { getWaitingRequests } from "@/lib/payments/payments.server";
import { formatAmount, formatDate } from "@/utils/format";
import { Policies } from "@/utils/policy.server";
import { withPolicyPage } from "@/utils/route.server";
import { Page, PageHeader } from "@bloomper/fgv-web-ui/shell/page-header";

/** Incoming bank transactions that nothing has been matched to. */
export default async function TransactionsPage() {
  return withPolicyPage(Policies.treasurer.requireTreasurer, async () => {
    const t = await getTranslations("Bank");
    const [transactions, waiting] = await Promise.all([getUnmatchedTransactions(), getWaitingRequests()]);
    const suggestions = await Promise.all(transactions.map((transaction) => getTransactionSuggestions(transaction.id)));
    const options = waiting.map((request) => ({
      id: request.id,
      label: `${request.reference} – ${request.spexareName ?? "?"} – ${formatAmount(request.amount - request.paid)}${request.status === "REPORTED" ? ` (${t("reported")})` : ""}`,
    }));
    const reported = waiting.filter((request) => request.status === "REPORTED");

    return (
      <Page variant="content">
        <PageHeader
          title={t("transactionsTitle")}
          description={
            <>
              {t("transactionsIntro")}{" "}
              <Link
                className="text-link hover:text-link/80"
                href="/treasurer/import"
              >
                {t("importTitle")}
              </Link>
            </>
          }
        />
        {transactions.length === 0 ? (
          <DataEmpty
            title={t("noTransactions")}
            description=""
          />
        ) : (
          <ul className="space-y-4">
            {transactions.map((transaction, index) => (
              <li key={transaction.id}>
                <Card>
                  <CardContent className="space-y-3">
                    <p>
                      {formatDate(transaction.bookedOn)} –{" "}
                      <span className="font-semibold">{formatAmount(transaction.amount)}</span> –{" "}
                      {transaction.payer ?? ""}
                      {transaction.text ? ` – ${transaction.text}` : ""}
                    </p>
                    <TransactionForm
                      id={transaction.id}
                      options={options}
                      suggested={suggestions[index].map((s) => ({ id: s.requestId, why: s.why }))}
                    />
                  </CardContent>
                </Card>
              </li>
            ))}
          </ul>
        )}
        <section className="space-y-2">
          <h2 className="text-lg font-semibold">{t("reportedWithoutMatch")}</h2>
          {reported.length === 0 ? (
            <p className="text-muted-foreground text-sm">{t("none")}</p>
          ) : (
            <ul className="space-y-1">
              {reported.map((request) => (
                <li key={request.id}>
                  {request.reference} – {request.spexareName ?? "?"} – {formatAmount(request.amount)}
                  {request.paidBy ? ` (${request.paidBy})` : ""}
                </li>
              ))}
            </ul>
          )}
        </section>
      </Page>
    );
  });
}
