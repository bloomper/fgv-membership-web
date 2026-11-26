"use client";

import { useTransition } from "react";
import { undoPayment } from "../bank-actions";

export function UndoButton({ id, labels }: { id: string; labels: { undo: string; confirm: string } }) {
  const [pending, start] = useTransition();

  return (
    <button className="underline" type="button" disabled={pending}
            onClick={() => { if (window.confirm(labels.confirm)) { start(async () => { await undoPayment(id); }); } }}>
      {labels.undo}
    </button>
  );
}
