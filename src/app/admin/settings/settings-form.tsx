"use client";

import { useActionState } from "react";
import { save, type SettingsState } from "./actions";

type Current = { swishNumber: string | null; bankgiro: string | null; bankAccount: string | null; payeeName: string | null; reminderDays: number; recipients: string };

export function SettingsForm({ current, labels }: { current: Current; labels: { swish: string; bankgiro: string; bank: string; payee: string; days: string; recipients: string; recipientsHint: string; save: string; saved: string } }) {
  const [state, action, pending] = useActionState<SettingsState, FormData>(save, null);

  return (
    <form action={action} className="max-w-xl space-y-3">
      <label className="block"><span className="text-sm">{labels.swish}</span><input className="input" name="swishNumber" defaultValue={current.swishNumber ?? ""} /></label>
      <label className="block"><span className="text-sm">{labels.bankgiro}</span><input className="input" name="bankgiro" defaultValue={current.bankgiro ?? ""} /></label>
      <label className="block"><span className="text-sm">{labels.bank}</span><input className="input" name="bankAccount" defaultValue={current.bankAccount ?? ""} /></label>
      <label className="block"><span className="text-sm">{labels.payee}</span><input className="input" name="payeeName" defaultValue={current.payeeName ?? ""} /></label>
      <label className="block"><span className="text-sm">{labels.days}</span><input className="input w-24" type="number" min={1} max={60} name="reminderDays" defaultValue={current.reminderDays} required /></label>
      <label className="block"><span className="text-sm">{labels.recipients}</span><textarea className="input" name="recipients" rows={3} defaultValue={current.recipients} placeholder={labels.recipientsHint} /></label>
      <button className="button" type="submit" disabled={pending}>{labels.save}</button>
      {state?.ok && <p role="status">{labels.saved}</p>}
      {state && !state.ok && <p role="alert" className="text-sm text-red-600">{state.message}</p>}
    </form>
  );
}
