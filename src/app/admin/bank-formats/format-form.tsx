"use client";

import { useActionState, useTransition } from "react";
import { deleteFormat, saveFormat, type FormatState } from "./actions";

type Format = { id: string; name: string; charset: string; delimiter: string; headerLines: number; dateColumn: number; amountColumn: number; textColumn: number; payerColumn: number | null; dateFormat: string; decimalComma: boolean };
type Labels = { name: string; charset: string; delimiter: string; headerLines: string; dateColumn: string; amountColumn: string; textColumn: string; payerColumn: string; dateFormat: string; decimalComma: string; save: string };

export function FormatForm({ format, labels }: { format: Format | null; labels: Labels }) {
  const [state, action, pending] = useActionState<FormatState, FormData>(saveFormat.bind(null, format?.id ?? null), null);

  return (
    <form action={action} className="flex flex-wrap items-end gap-2">
      <label className="text-sm">{labels.name}<input className="input" name="name" defaultValue={format?.name} required maxLength={100} /></label>
      <label className="text-sm">{labels.charset}<input className="input w-28" name="charset" defaultValue={format?.charset ?? "UTF-8"} required /></label>
      <label className="text-sm">{labels.delimiter}<input className="input w-12" name="delimiter" defaultValue={format?.delimiter ?? ";"} maxLength={1} required /></label>
      <label className="text-sm">{labels.headerLines}<input className="input w-16" type="number" min={0} name="headerLines" defaultValue={format?.headerLines ?? 1} required /></label>
      <label className="text-sm">{labels.dateColumn}<input className="input w-16" type="number" min={1} name="dateColumn" defaultValue={format?.dateColumn} required /></label>
      <label className="text-sm">{labels.amountColumn}<input className="input w-16" type="number" min={1} name="amountColumn" defaultValue={format?.amountColumn} required /></label>
      <label className="text-sm">{labels.textColumn}<input className="input w-16" type="number" min={1} name="textColumn" defaultValue={format?.textColumn} required /></label>
      <label className="text-sm">{labels.payerColumn}<input className="input w-16" type="number" min={1} name="payerColumn" defaultValue={format?.payerColumn ?? ""} /></label>
      <label className="text-sm">{labels.dateFormat}<input className="input w-32" name="dateFormat" defaultValue={format?.dateFormat ?? "yyyy-MM-dd"} required /></label>
      <label className="flex items-center gap-1 text-sm"><input type="checkbox" name="decimalComma" defaultChecked={format?.decimalComma ?? true} /> {labels.decimalComma}</label>
      <button className="button-secondary" type="submit" disabled={pending}>{labels.save}</button>
      {state && !state.ok && <span role="alert" className="text-sm text-red-600">{state.message}</span>}
    </form>
  );
}

export function DeleteFormat({ id, labels }: { id: string; labels: { delete: string; confirm: string } }) {
  const [pending, start] = useTransition();

  return (
    <button className="underline text-sm" type="button" disabled={pending}
            onClick={() => { if (window.confirm(labels.confirm)) { start(async () => { await deleteFormat(id); }); } }}>
      {labels.delete}
    </button>
  );
}
