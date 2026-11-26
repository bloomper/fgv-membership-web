import { getFormatter, getTranslations } from "next-intl/server";
import Link from "next/link";
import { requireRole } from "@/lib/guard";
import { suggestionsFor, unmatchedTransactions, waitingRequests } from "@/lib/payment";
import { TransactionForm } from "./transaction-form";

export default async function TransactionsPage() {
  const viewer = await requireRole("TREASURER", "/treasurer/transactions");
  const t = await getTranslations("bank");
  const format = await getFormatter();
  const [transactions, waiting] = await Promise.all([unmatchedTransactions(viewer.accessToken), waitingRequests(viewer.accessToken)]);
  const suggestions = await Promise.all(transactions.map((transaction) => suggestionsFor(viewer.accessToken, transaction.id)));
  const options = waiting.map((request) => ({
    id: request.id,
    label: `${request.reference} – ${request.spexareName ?? "?"} – ${request.amount - request.paid} kr${request.status === "REPORTED" ? ` (${t("reported")})` : ""}`,
  }));
  const reported = waiting.filter((request) => request.status === "REPORTED");

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">{t("transactionsTitle")}</h1>
      <p className="text-sm">{t("transactionsIntro")} <Link className="underline" href="/treasurer/import">{t("importTitle")}</Link></p>
      {transactions.length === 0 ? <p>{t("noTransactions")}</p> : (
        <ul className="space-y-4">
          {transactions.map((transaction, index) => (
            <li key={transaction.id} className="space-y-2 rounded border border-zinc-200 p-3 dark:border-zinc-800">
              <p>
                {transaction.bookedOn} – <span className="font-semibold">{format.number(transaction.amount)} kr</span> – {transaction.payer ?? ""}
                {transaction.text ? ` – ${transaction.text}` : ""}
              </p>
              <TransactionForm id={transaction.id} options={options}
                               suggested={suggestions[index].map((s) => ({ id: s.requestId, why: s.why }))}
                               labels={{ match: t("match"), dismiss: t("dismiss"), confirmDismiss: t("confirmDismiss"), pick: t("pickRequests"),
                                 suggestion: t("suggestion"), mistyped: t("mistypedReference") }} />
            </li>
          ))}
        </ul>
      )}
      <section className="space-y-2">
        <h2 className="font-semibold">{t("reportedWithoutMatch")}</h2>
        {reported.length === 0 ? <p>{t("none")}</p> : (
          <ul className="space-y-1">
            {reported.map((request) => (
              <li key={request.id}>{request.reference} – {request.spexareName ?? "?"} – {format.number(request.amount)} kr{request.paidBy ? ` (${request.paidBy})` : ""}</li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
