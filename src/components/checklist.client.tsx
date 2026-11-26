"use client";

import {useId} from "react";
import {Checkbox} from "@/components/ui/checkbox";
import {Label} from "@/components/ui/label";

export type ChecklistOption = { id: string; label: string; hint?: string };

/** A list of checkboxes for picking several of something; the value is the ids that are ticked. */
export function Checklist({legend, options, value, onChange}: {
    legend: string;
    options: ChecklistOption[];
    value: string[];
    onChange: (value: string[]) => void;
}) {
    const id = useId();

    return (
        <fieldset className="max-h-72 space-y-1 overflow-y-auto">
            <legend className="mb-1 text-sm font-medium">{legend}</legend>
            {options.map(option => (
                <div key={option.id} className="flex items-center gap-3">
                    <Checkbox id={`${id}-${option.id}`} checked={value.includes(option.id)}
                              onCheckedChange={checked => onChange(checked ? [...value, option.id] : value.filter(held => held !== option.id))}/>
                    <Label htmlFor={`${id}-${option.id}`} className="min-h-8 flex-1 cursor-pointer text-sm">
                        {option.label}
                        {option.hint && <em className="ml-2 text-muted-foreground">{option.hint}</em>}
                    </Label>
                </div>
            ))}
        </fieldset>
    );
}
