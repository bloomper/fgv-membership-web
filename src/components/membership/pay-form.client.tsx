"use client";

import {useId, useState, useTransition} from "react";
import {useRouter} from "next/navigation";
import {useTranslations} from "next-intl";
import {Button} from "@bloomper/fgv-web-ui/ui/button";
import {Checkbox} from "@bloomper/fgv-web-ui/ui/checkbox";
import {Label} from "@bloomper/fgv-web-ui/ui/label";
import {Textarea} from "@bloomper/fgv-web-ui/ui/textarea";
import {FormError} from "@/components/form-error";
import {requestPaymentAction} from "@/app/(app)/membership/actions.server";
import {useActionFeedback} from "@/hooks/use-action-feedback";
import {MAX_FAMILY_NOTE} from "@/lib/membership/schema";
import {formatAmount} from "@/utils/format";

export type FeeOption = { id: string; group: string; label: string; amount: number; family: boolean };

/** One fee for each year, or the life fee; they are added up. */
export function PayForm({options}: { options: FeeOption[] }) {
    const t = useTranslations("Pay");
    const id = useId();
    const router = useRouter();
    const feedback = useActionFeedback();
    const [pending, startTransition] = useTransition();
    const [chosen, setChosen] = useState<Record<string, string>>({});
    const [familyNote, setFamilyNote] = useState("");
    const [missing, setMissing] = useState(false);
    const groups = [...new Set(options.map(option => option.group))];
    const picked = Object.values(chosen).map(optionId => options.find(option => option.id === optionId)).filter(option => option !== undefined);
    const total = picked.reduce((sum, option) => sum + option.amount, 0);

    const toggle = (group: string, optionId: string) => {
        setMissing(false);
        setChosen(current => {
            const {[group]: held, ...rest} = current;

            return held === optionId ? rest : {...rest, [group]: optionId};
        });
    };

    return (
        <form className="max-w-xl space-y-6"
              onSubmit={event => {
                  event.preventDefault();
                  if (picked.length === 0) {
                      setMissing(true);
                      return;
                  }
                  startTransition(async () => {
                      const result = await requestPaymentAction({feeLevelIds: picked.map(option => option.id), familyNote});

                      if (feedback(result) && result.data) {
                          router.push(`/membership/pay/${result.data}`);
                      }
                  });
              }}>
            {groups.map(group => (
                <fieldset key={group} className="space-y-2">
                    <legend className="mb-1 font-semibold">{group === "life" ? t("lifeGroup") : group}</legend>
                    {options.filter(option => option.group === group).map(option => (
                        <div key={option.id} className="flex items-center gap-3">
                            <Checkbox id={`${id}-${option.id}`} checked={chosen[group] === option.id}
                                      onCheckedChange={() => toggle(group, option.id)}/>
                            <Label htmlFor={`${id}-${option.id}`} className="min-h-8 flex-1 cursor-pointer">
                                {option.label}: {formatAmount(option.amount)}
                            </Label>
                        </div>
                    ))}
                </fieldset>
            ))}
            {picked.some(option => option.family) && (
                <div className="space-y-2">
                    <Label htmlFor={`${id}-family`}>{t("familyNote")}</Label>
                    <Textarea id={`${id}-family`} rows={3} maxLength={MAX_FAMILY_NOTE} placeholder={t("familyHint")}
                              value={familyNote} onChange={event => setFamilyNote(event.target.value)}/>
                </div>
            )}
            <p className="font-semibold">{t("total")}: {formatAmount(total)}</p>
            <FormError message={missing ? "feeRequired" : undefined}/>
            <Button type="submit" disabled={pending}>{t("submit")}</Button>
        </form>
    );
}
