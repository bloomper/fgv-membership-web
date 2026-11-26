"use client";

import { useTransition } from "react";
import { runJob } from "./actions";

export function RunButton({ name, label }: { name: string; label: string }) {
  const [pending, start] = useTransition();

  return <button className="button-secondary" type="button" disabled={pending} onClick={() => start(async () => { await runJob(name); })}>{label}</button>;
}
