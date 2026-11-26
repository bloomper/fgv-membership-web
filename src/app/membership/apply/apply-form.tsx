"use client";

import { useActionState } from "react";
import { apply, type ApplyState } from "./actions";

export function ApplyForm({ defaultName, labels }: { defaultName: string; labels: { name: string; text: string; hint: string; submit: string } }) {
  const [state, action, pending] = useActionState<ApplyState, FormData>(apply, null);

  return (
    <form action={action} className="max-w-xl space-y-3">
      <label className="block"><span className="text-sm">{labels.name}</span><input className="input" name="name" defaultValue={defaultName} required maxLength={200} /></label>
      <label className="block"><span className="text-sm">{labels.text}</span><textarea className="input" name="text" rows={5} required maxLength={1000} placeholder={labels.hint} /></label>
      <button className="button" type="submit" disabled={pending}>{labels.submit}</button>
      {state && !state.ok && <p role="alert" className="text-sm text-red-600">{state.message}</p>}
    </form>
  );
}
