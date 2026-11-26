"use client";

import { useActionState, useTransition } from "react";
import { dismissTransaction, matchTransaction, type BankState } from "../bank-actions";

type Labels = { match: string; dismiss: string; confirmDismiss: string; pick: string; suggestion: string; mistyped: string };

/** Pick the request or requests the money was for; suggested ones are marked and ticked. */
export function TransactionForm({ id, options, suggested, labels }: {
  id: string;
  options: { id: string; label: string }[];
  suggested: { id: string; why: "REFERENCE" | "NAME" }[];
  labels: Labels;
}) {
  const [state, action, pending] = useActionState<BankState, FormData>(matchTransaction.bind(null, id), null);
  const [dismissing, startDismiss] = useTransition();
  const mark = (requestId: string) => suggested.find((s) => s.id === requestId);
  const ordered = [...options].sort((a, b) => Number(Boolean(mark(b.id))) - Number(Boolean(mark(a.id))));

  return (
    <form action={action} className="space-y-2">
      <fieldset className="max-h-48 space-y-1 overflow-y-auto">
        <legend className="text-sm">{labels.pick}</legend>
        {ordered.map((option) => (
          <label key={option.id} className="flex items-center gap-2 text-sm">
            <input type="checkbox" name="request" value={option.id} defaultChecked={suggested.length === 1 && suggested[0].id === option.id} />
            {option.label}
            {mark(option.id) && <em>{mark(option.id)!.why === "REFERENCE" ? labels.mistyped : labels.suggestion}</em>}
          </label>
        ))}
      </fieldset>
      <div className="flex gap-2">
        <button className="button" type="submit" disabled={pending}>{labels.match}</button>
        <button className="button-secondary" type="button" disabled={dismissing}
                onClick={() => { if (window.confirm(labels.confirmDismiss)) { startDismiss(async () => { await dismissTransaction(id); }); } }}>
          {labels.dismiss}
        </button>
      </div>
      {state && !state.ok && <p role="alert" className="text-sm text-red-600">{state.message}</p>}
    </form>
  );
}
