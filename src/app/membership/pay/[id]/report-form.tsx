"use client";

import { useActionState } from "react";
import { reportPaid, type PayState } from "../../actions";

export function ReportForm({ id, labels }: { id: string; labels: { paidBy: string; paidByHint: string; submit: string; done: string } }) {
  const [state, action, pending] = useActionState<PayState, FormData>(reportPaid.bind(null, id), null);

  return (
    <form action={action} className="space-y-2">
      <label className="block">
        <span className="text-sm">{labels.paidBy}</span>
        <input className="input" name="paidBy" maxLength={200} placeholder={labels.paidByHint} />
      </label>
      <button className="button" type="submit" disabled={pending}>{labels.submit}</button>
      {state?.ok && <p role="status">{labels.done}</p>}
      {state && !state.ok && <p role="alert" className="text-sm text-red-600">{state.message}</p>}
    </form>
  );
}
