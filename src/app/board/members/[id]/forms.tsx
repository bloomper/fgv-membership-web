"use client";

import { useActionState } from "react";
import { grantWaiver, recordWithoutRequest, sendLink, type BoardState } from "../../actions";

type Option = { id: string; label: string };

function Fees({ options }: { options: Option[] }) {
  return (
    <fieldset className="space-y-1">
      {options.map((option) => (
        <label key={option.id} className="flex items-center gap-2 text-sm"><input type="checkbox" name="fee" value={option.id} /> {option.label}</label>
      ))}
    </fieldset>
  );
}

function Errors({ state }: { state: BoardState }) {
  return state && !state.ok ? <p role="alert" className="text-sm text-red-600">{state.message}</p> : null;
}

export function WaiverForm({ spexareId, year, labels }: { spexareId: string; year: number; labels: { year: string; lifetime: string; note: string; submit: string } }) {
  const [state, action, pending] = useActionState<BoardState, FormData>(grantWaiver.bind(null, spexareId), null);

  return (
    <form action={action} className="flex flex-wrap items-end gap-2">
      <label className="text-sm">{labels.year}<input className="input w-24" type="number" name="year" defaultValue={year} required /></label>
      <label className="flex items-center gap-1 text-sm"><input type="checkbox" name="lifetime" /> {labels.lifetime}</label>
      <label className="text-sm">{labels.note}<input className="input" name="note" required maxLength={500} /></label>
      <button className="button-secondary" type="submit" disabled={pending}>{labels.submit}</button>
      <Errors state={state} />
    </form>
  );
}

export function LinkForm({ spexareId, options, labels }: { spexareId: string; options: Option[]; labels: { submit: string; sent: string; notSent: string } }) {
  const [state, action, pending] = useActionState<BoardState, FormData>(sendLink.bind(null, spexareId), null);

  return (
    <form action={action} className="space-y-2">
      <Fees options={options} />
      <button className="button-secondary" type="submit" disabled={pending}>{labels.submit}</button>
      {state?.ok && <p role="status">{state.info === "sent" ? labels.sent : labels.notSent}</p>}
      <Errors state={state} />
    </form>
  );
}

export function RecordForm({ spexareId, options, today, labels }: {
  spexareId: string; options: Option[]; today: string;
  labels: { date: string; amount: string; how: string; note: string; submit: string; hows: Record<"SWISH" | "BANK_TRANSFER" | "CASH", string> };
}) {
  const [state, action, pending] = useActionState<BoardState, FormData>(recordWithoutRequest.bind(null, spexareId), null);

  return (
    <form action={action} className="space-y-2">
      <Fees options={options} />
      <div className="flex flex-wrap items-end gap-2">
        <label className="text-sm">{labels.date}<input className="input" type="date" name="paidOn" defaultValue={today} required /></label>
        <label className="text-sm">{labels.amount}<input className="input w-28" type="number" min={1} name="amount" required /></label>
        <label className="text-sm">{labels.how}
          <select className="input" name="how" defaultValue="SWISH">
            {(Object.keys(labels.hows) as (keyof typeof labels.hows)[]).map((how) => <option key={how} value={how}>{labels.hows[how]}</option>)}
          </select>
        </label>
        <label className="text-sm">{labels.note}<input className="input" name="note" maxLength={500} /></label>
        <button className="button-secondary" type="submit" disabled={pending}>{labels.submit}</button>
      </div>
      {state?.ok && <p role="status">OK</p>}
      <Errors state={state} />
    </form>
  );
}
