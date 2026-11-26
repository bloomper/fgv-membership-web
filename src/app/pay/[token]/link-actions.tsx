"use client";

import { useActionState } from "react";
import { optOut, report, type LinkState } from "./actions";

type Labels = { paidBy: string; paidByHint: string; submit: string; done: string; optOut?: string; optedOut?: string };

export function LinkActions({ token, labels, optOutOnly }: { token: string; labels: Labels; optOutOnly?: boolean }) {
  const [reported, reportAction, reporting] = useActionState<LinkState, FormData>(report.bind(null, token), null);
  const [opted, optAction, opting] = useActionState<LinkState, FormData>(async () => optOut(token), null);

  if (optOutOnly) {
    return (
      <form action={optAction}>
        <button className="underline" type="submit" disabled={opting}>{labels.optOut}</button>
        {opted?.ok && <span role="status"> {labels.optedOut}</span>}
      </form>
    );
  }
  return (
    <form action={reportAction} className="space-y-2">
      <label className="block">
        <span className="text-sm">{labels.paidBy}</span>
        <input className="input" name="paidBy" maxLength={200} placeholder={labels.paidByHint} />
      </label>
      <button className="button" type="submit" disabled={reporting}>{labels.submit}</button>
      {reported?.ok && <p role="status">{labels.done}</p>}
    </form>
  );
}
