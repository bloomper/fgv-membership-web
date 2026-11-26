"use client";

import { useActionState } from "react";
import { sendRenewals, type BoardState } from "../actions";

export function RenewalForm({ year, feeId, labels }: { year: number; feeId: string; labels: { send: string; confirm: string; done: string } }) {
  const [state, action, pending] = useActionState<BoardState, FormData>(sendRenewals.bind(null, year), null);
  const [sent, skipped] = (state?.info ?? "").split("/");

  return (
    <form action={action} className="space-y-2" onSubmit={(event) => { if (!window.confirm(labels.confirm)) { event.preventDefault(); } }}>
      <input type="hidden" name="fee" value={feeId} />
      <button className="button" type="submit" disabled={pending}>{labels.send}</button>
      {state?.ok && <p role="status">{labels.done.replace("{sent}", sent).replace("{skipped}", skipped)}</p>}
      {state && !state.ok && <p role="alert" className="text-sm text-red-600">{state.message}</p>}
    </form>
  );
}
