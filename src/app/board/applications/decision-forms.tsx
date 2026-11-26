"use client";

import { useActionState } from "react";
import { accept, reject, type AppState } from "./actions";

type Labels = { pick: string; create: string; accept: string; message: string; reject: string; confirmReject: string };

export function DecisionForms({ id, people, labels }: { id: string; people: { id: string; name: string }[]; labels: Labels }) {
  const [accepted, acceptAction, accepting] = useActionState<AppState, FormData>(accept.bind(null, id), null);
  const [rejected, rejectAction, rejecting] = useActionState<AppState, FormData>(reject.bind(null, id), null);

  return (
    <div className="space-y-3">
      <form action={acceptAction} className="space-y-1">
        <fieldset className="space-y-1">
          <legend className="text-sm">{labels.pick}</legend>
          <label className="flex items-center gap-2 text-sm"><input type="radio" name="spexare" value="" defaultChecked /> {labels.create}</label>
          {people.map((person) => <label key={person.id} className="flex items-center gap-2 text-sm"><input type="radio" name="spexare" value={person.id} /> {person.name}</label>)}
        </fieldset>
        <button className="button" type="submit" disabled={accepting}>{labels.accept}</button>
        {accepted && !accepted.ok && <p role="alert" className="text-sm text-red-600">{accepted.message}</p>}
      </form>
      <form action={rejectAction} className="flex flex-wrap items-end gap-2" onSubmit={(event) => { if (!window.confirm(labels.confirmReject)) { event.preventDefault(); } }}>
        <label className="text-sm">{labels.message}<input className="input" name="message" maxLength={500} /></label>
        <button className="button-secondary" type="submit" disabled={rejecting}>{labels.reject}</button>
        {rejected && !rejected.ok && <span role="alert" className="text-sm text-red-600">{rejected.message}</span>}
      </form>
    </div>
  );
}
