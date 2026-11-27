"use client";

import {useId, useState, useTransition} from "react";
import {useTranslations} from "next-intl";
import {Button} from "@bloomper/fgv-web-ui/ui/button";
import {Input} from "@bloomper/fgv-web-ui/ui/input";
import {Label} from "@bloomper/fgv-web-ui/ui/label";
import {NativeSelect, NativeSelectOption} from "@bloomper/fgv-web-ui/ui/native-select";
import {type ImportSummary, importFileAction} from "@/app/(app)/treasurer/actions.server";
import {useActionFeedback} from "@/hooks/use-action-feedback";

/** Uploads a bank statement in the format picked, and says what became of it. */
export function ImportForm({formats}: { formats: { id: string; name: string }[] }) {
    const t = useTranslations("Bank");
    const id = useId();
    const feedback = useActionFeedback();
    const [pending, startTransition] = useTransition();
    const [result, setResult] = useState<ImportSummary | null>(null);

    return (
        <div className="space-y-4">
            <form className="flex flex-wrap items-end gap-3"
                  onSubmit={event => {
                      event.preventDefault();

                      const data = new FormData(event.currentTarget);

                      startTransition(async () => {
                          const outcome = await importFileAction(data);

                          setResult(outcome.ok ? outcome.data ?? null : null);
                          if (outcome.ok && outcome.data && outcome.data.errors.length === 0) {
                              feedback(outcome, t("imported"));
                          } else if (!outcome.ok) {
                              feedback(outcome);
                          }
                      });
                  }}>
                <div className="space-y-2">
                    <Label htmlFor={`${id}-format`}>{t("format")}</Label>
                    <NativeSelect id={`${id}-format`} name="formatId" required>
                        {formats.map(format => <NativeSelectOption key={format.id} value={format.id}>{format.name}</NativeSelectOption>)}
                    </NativeSelect>
                </div>
                <div className="space-y-2">
                    <Label htmlFor={`${id}-file`}>{t("file")}</Label>
                    <Input id={`${id}-file`} type="file" name="file" accept=".csv,.txt,text/csv" required/>
                </div>
                <Button type="submit" disabled={pending}>{t("upload")}</Button>
            </form>
            {result && result.errors.length > 0 && (
                <div role="alert" className="text-sm text-destructive">
                    <p className="font-semibold">{t("errors")}</p>
                    <ul className="list-disc pl-5">{result.errors.map(error => <li key={error}>{error}</li>)}</ul>
                </div>
            )}
            {result && result.errors.length === 0 && (
                <dl role="status" className="grid grid-cols-[auto_1fr] gap-x-4">
                    <dt>{t("read")}</dt><dd>{result.read}</dd>
                    <dt>{t("added")}</dt><dd>{result.added}</dd>
                    <dt>{t("duplicates")}</dt><dd>{result.duplicates}</dd>
                    <dt>{t("outgoing")}</dt><dd>{result.outgoing}</dd>
                    <dt>{t("matchedAtOnce")}</dt><dd>{result.matched}</dd>
                </dl>
            )}
        </div>
    );
}
