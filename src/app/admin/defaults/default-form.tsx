"use client";

import { useActionState } from "react";
import { saveDefault, type DefaultsState } from "./actions";

export function DefaultForm({ profile, entry, labels }: { profile: string; entry: { clientId: string; ladder: string[]; role: string | null }; labels: { none: string; save: string } }) {
  const [state, action, pending] = useActionState<DefaultsState, FormData>(saveDefault.bind(null, profile, entry.clientId), null);

  return (
    <form action={action} className="flex items-center gap-2">
      <select className="input w-44" name="role" defaultValue={entry.role ?? ""} aria-label={entry.clientId}>
        <option value="">{labels.none}</option>
        {entry.ladder.map((role) => <option key={role} value={role}>{role}</option>)}
      </select>
      <button className="button-secondary" type="submit" disabled={pending}>{labels.save}</button>
      {state && !state.ok && <span role="alert" className="text-sm text-red-600">{state.message}</span>}
    </form>
  );
}
