"use client";

import { useActionState, useState } from "react";
import { startPayment, type PayState } from "../actions";

type Option = { id: string; group: string; label: string; amount: number; family: boolean };

/** One fee for each year, or the life fee; they are added up. */
export function PayForm({ options, labels }: { options: Option[]; labels: { submit: string; total: string; life: string; familyNote: string; familyHint: string } }) {
  const [state, action, pending] = useActionState<PayState, FormData>(startPayment, null);
  const [chosen, setChosen] = useState<Record<string, string>>({});
  const groups = [...new Set(options.map((option) => option.group))];
  const wantsFamily = Object.values(chosen).some((id) => options.find((option) => option.id === id)?.family);
  const total = Object.values(chosen).reduce((sum, id) => sum + (options.find((option) => option.id === id)?.amount ?? 0), 0);

  return (
    <form action={action} className="space-y-4">
      {groups.map((group) => (
        <fieldset key={group} className="space-y-1">
          <legend className="font-semibold">{group === "life" ? labels.life : group}</legend>
          {options.filter((option) => option.group === group).map((option) => (
            <label key={option.id} className="flex items-center gap-2">
              <input type={group === "life" ? "checkbox" : "radio"} name={`fee-${group}`} value={option.id}
                     checked={chosen[group] === option.id}
                     onChange={() => setChosen((current) => ({ ...current, [group]: option.id }))}
                     onClick={() => { if (chosen[group] === option.id) { setChosen(({ [group]: _removed, ...rest }) => rest); } }} />
              {option.label}: {option.amount} kr
            </label>
          ))}
        </fieldset>
      ))}
      {Object.values(chosen).map((id) => <input key={id} type="hidden" name="fee" value={id} />)}
      {wantsFamily && (
        <label className="block">
          <span className="text-sm">{labels.familyNote}</span>
          <textarea className="input" name="familyNote" rows={3} maxLength={500} placeholder={labels.familyHint} />
        </label>
      )}
      <p className="font-semibold">{labels.total}: {total} kr</p>
      <button className="button" type="submit" disabled={pending || total === 0}>{labels.submit}</button>
      {state && !state.ok && <p role="alert" className="text-sm text-red-600">{state.message}</p>}
    </form>
  );
}
