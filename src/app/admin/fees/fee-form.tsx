"use client";

import { useActionState, useTransition } from "react";
import { retireFee, saveFee, type FeeState } from "./actions";

type Fee = { id: string; year: number | null; kind: "STANDARD" | "FAMILY" | "LIFETIME" | "SUPPORT"; nameSv: string; nameEn: string; amount: number };
type Labels = { year: string; kind: string; kinds: Record<"STANDARD" | "FAMILY" | "LIFETIME" | "SUPPORT", string>; nameSv: string; nameEn: string; amount: string; save: string };

export function FeeForm({ fee, labels }: { fee: Fee | null; labels: Labels }) {
  const [state, action, pending] = useActionState<FeeState, FormData>(saveFee.bind(null, fee?.id ?? null), null);

  return (
    <form action={action} className="flex flex-wrap items-end gap-2">
      <label className="text-sm">{labels.kind}
        <select className="input" name="kind" defaultValue={fee?.kind ?? "STANDARD"}>
          {(Object.keys(labels.kinds) as (keyof Labels["kinds"])[]).map((kind) => <option key={kind} value={kind}>{labels.kinds[kind]}</option>)}
        </select>
      </label>
      <label className="text-sm">{labels.year}<input className="input w-24" type="number" name="year" min={1948} defaultValue={fee ? fee.year ?? "" : new Date().getFullYear() + 1} /></label>
      <label className="text-sm">{labels.nameSv}<input className="input" name="nameSv" defaultValue={fee?.nameSv} required maxLength={100} /></label>
      <label className="text-sm">{labels.nameEn}<input className="input" name="nameEn" defaultValue={fee?.nameEn} required maxLength={100} /></label>
      <label className="text-sm">{labels.amount}<input className="input w-24" type="number" name="amount" min={0} defaultValue={fee?.amount} required /></label>
      <button className="button-secondary" type="submit" disabled={pending}>{labels.save}</button>
      {state && !state.ok && <span role="alert" className="text-sm text-red-600">{state.message}</span>}
    </form>
  );
}

export function RetireButton({ id, retired, labels }: { id: string; retired: boolean; labels: { retire: string; restore: string } }) {
  const [pending, start] = useTransition();

  return (
    <button className="underline text-sm" type="button" disabled={pending} onClick={() => start(async () => { await retireFee(id, !retired); })}>
      {retired ? labels.restore : labels.retire}
    </button>
  );
}
