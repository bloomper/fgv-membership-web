"use client";

import { useActionState } from "react";
import { importFile, type BankState } from "../bank-actions";

type Labels = { format: string; file: string; submit: string; read: string; added: string; duplicates: string; outgoing: string; matched: string; errors: string };

export function ImportForm({ formats, labels }: { formats: { id: string; name: string }[]; labels: Labels }) {
  const [state, action, pending] = useActionState<BankState, FormData>(importFile, null);
  const result = state?.result;

  return (
    <div className="space-y-4">
      <form action={action} className="flex flex-wrap items-end gap-2">
        <label className="text-sm">{labels.format}
          <select className="input" name="formatId" required>
            {formats.map((format) => <option key={format.id} value={format.id}>{format.name}</option>)}
          </select>
        </label>
        <label className="text-sm">{labels.file}<input className="input" type="file" name="file" accept=".csv,.txt,text/csv" required /></label>
        <button className="button" type="submit" disabled={pending}>{labels.submit}</button>
      </form>
      {state && !state.ok && state.message && <p role="alert" className="text-sm text-red-600">{state.message}</p>}
      {result && result.errors.length > 0 && (
        <div role="alert" className="text-sm text-red-600">
          <p className="font-semibold">{labels.errors}</p>
          <ul className="list-disc pl-5">{result.errors.map((error) => <li key={error}>{error}</li>)}</ul>
        </div>
      )}
      {result && result.errors.length === 0 && (
        <dl role="status" className="grid grid-cols-[auto_1fr] gap-x-4">
          <dt>{labels.read}</dt><dd>{result.read}</dd>
          <dt>{labels.added}</dt><dd>{result.added}</dd>
          <dt>{labels.duplicates}</dt><dd>{result.duplicates}</dd>
          <dt>{labels.outgoing}</dt><dd>{result.outgoing}</dd>
          <dt>{labels.matched}</dt><dd>{result.matched}</dd>
        </dl>
      )}
    </div>
  );
}
