"use client";

import { useActionState, useTransition } from "react";
import {
  reject, resendVerification, sendPasswordReset, sendSetPassword, setAccess, setEnabled, type ActionState,
} from "../actions";

type Access = { clientId: string; ladder: string[]; highest: string | null };

export function AccessForm({ userId, access, labels }: { userId: string; access: Access; labels: { none: string; save: string; role: string; notify: string } }) {
  const [state, action, pending] = useActionState<ActionState, FormData>(setAccess.bind(null, userId), null);

  return (
    <form action={action} className="flex items-center gap-2">
      <input type="hidden" name="clientId" value={access.clientId} />
      <select className="input w-44" name="role" defaultValue={access.highest ?? ""} aria-label={labels.role}>
        <option value="">{labels.none}</option>
        {access.ladder.map((role) => <option key={role} value={role}>{role}</option>)}
      </select>
      <label className="flex items-center gap-1 text-sm">
        <input type="checkbox" name="notify" defaultChecked /> {labels.notify}
      </label>
      <button className="button-secondary" type="submit" disabled={pending}>{labels.save}</button>
      {state && !state.ok && <span role="alert" className="text-sm text-red-600">{state.message}</span>}
    </form>
  );
}

export function ActionButton({ userId, action, label, confirm }: {
  userId: string;
  action: "activate" | "deactivate" | "resendVerification" | "setPassword" | "resetPassword";
  label: string;
  confirm?: string;
}) {
  const [pending, start] = useTransition();
  const [state, run] = useActionState<ActionState, void>(async () => {
    switch (action) {
      case "activate": return setEnabled(userId, true);
      case "deactivate": return setEnabled(userId, false);
      case "resendVerification": return resendVerification(userId);
      case "setPassword": return sendSetPassword(userId);
      case "resetPassword": return sendPasswordReset(userId);
    }
  }, null);

  return (
    <span className="inline-flex items-center gap-2">
      <button className="button-secondary" type="button" disabled={pending}
              onClick={() => { if (!confirm || window.confirm(confirm)) { start(() => run()); } }}>
        {label}
      </button>
      {state && !state.ok && <span role="alert" className="text-sm text-red-600">{state.message}</span>}
    </span>
  );
}

export function RejectForm({ userId, labels }: { userId: string; labels: { message: string; submit: string; confirm: string; notify: string } }) {
  const [state, action, pending] = useActionState<ActionState, FormData>(reject.bind(null, userId), null);

  return (
    <form action={action} className="space-y-2" onSubmit={(event) => { if (!window.confirm(labels.confirm)) { event.preventDefault(); } }}>
      <textarea className="input" name="message" rows={3} maxLength={500} placeholder={labels.message} aria-label={labels.message} />
      <label className="flex items-center gap-1 text-sm">
        <input type="checkbox" name="notify" defaultChecked /> {labels.notify}
      </label>
      <button className="button-secondary" type="submit" disabled={pending}>{labels.submit}</button>
      {state && !state.ok && <p role="alert" className="text-sm text-red-600">{state.message}</p>}
    </form>
  );
}
