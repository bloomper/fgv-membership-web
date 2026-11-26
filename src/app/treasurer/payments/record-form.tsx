"use client";

import { useActionState, useTransition } from "react";
import { cancelRequest, recordPayment, type TreasurerState } from "../actions";

type Labels = {
  date: string; amount: string; how: string; note: string; record: string; cancel: string; confirmCancel: string;
  hows: Record<"SWISH" | "BANK_TRANSFER" | "CASH", string>;
};

export function RecordForm({ requestId, amount, today, labels }: { requestId: string; amount: number; today: string; labels: Labels }) {
  const [state, action, pending] = useActionState<TreasurerState, FormData>(recordPayment.bind(null, requestId), null);
  const [cancelling, startCancel] = useTransition();

  return (
    <form action={action} className="flex flex-wrap items-end gap-2">
      <label className="text-sm">{labels.date}<input className="input" type="date" name="paidOn" defaultValue={today} required /></label>
      <label className="text-sm">{labels.amount}<input className="input w-28" type="number" name="amount" min={1} defaultValue={amount} required /></label>
      <label className="text-sm">{labels.how}
        <select className="input" name="how" defaultValue="SWISH">
          {(Object.keys(labels.hows) as (keyof Labels["hows"])[]).map((how) => <option key={how} value={how}>{labels.hows[how]}</option>)}
        </select>
      </label>
      <label className="text-sm">{labels.note}<input className="input" name="note" maxLength={500} /></label>
      <button className="button" type="submit" disabled={pending}>{labels.record}</button>
      <button className="button-secondary" type="button" disabled={cancelling}
              onClick={() => { if (window.confirm(labels.confirmCancel)) { startCancel(async () => { await cancelRequest(requestId); }); } }}>
        {labels.cancel}
      </button>
      {state && !state.ok && <span role="alert" className="text-sm text-red-600">{state.message}</span>}
    </form>
  );
}
