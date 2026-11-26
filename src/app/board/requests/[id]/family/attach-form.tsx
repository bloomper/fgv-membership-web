"use client";

import { useActionState } from "react";
import { addFamilyMembers, type BoardState } from "../../../actions";

export function AttachForm({ requestId, people, labels }: { requestId: string; people: { id: string; name: string }[]; labels: { add: string } }) {
  const [state, action, pending] = useActionState<BoardState, FormData>(addFamilyMembers.bind(null, requestId), null);

  return (
    <form action={action} className="space-y-2">
      {people.map((person) => (
        <label key={person.id} className="flex items-center gap-2 text-sm"><input type="checkbox" name="person" value={person.id} /> {person.name}</label>
      ))}
      <button className="button" type="submit" disabled={pending}>{labels.add}</button>
      {state && !state.ok && <p role="alert" className="text-sm text-red-600">{state.message}</p>}
    </form>
  );
}
