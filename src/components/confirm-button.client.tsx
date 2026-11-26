"use client";

import {useState, useTransition} from "react";
import {useTranslations} from "next-intl";
import {Button} from "@/components/ui/button";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

/**
 * A button that asks before it does something that is hard to take back. {@code onConfirm} runs once the user has
 * confirmed, and the dialog closes when it is done.
 */
export function ConfirmButton({label, title, description, confirmLabel, variant = "outline", size = "default", onConfirm}: {
    label: string;
    title: string;
    description?: string;
    confirmLabel?: string;
    variant?: "default" | "outline" | "destructive" | "ghost";
    size?: "default" | "sm";
    onConfirm: () => Promise<void>;
}) {
    const t = useTranslations("Common");
    const [open, setOpen] = useState(false);
    const [pending, startTransition] = useTransition();

    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogTrigger render={<Button variant={variant} size={size} disabled={pending}/>}>
                {label}
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>{title}</AlertDialogTitle>
                    {description && <AlertDialogDescription>{description}</AlertDialogDescription>}
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>{t("cancel")}</AlertDialogCancel>
                    <AlertDialogAction
                        variant={variant === "destructive" ? "destructive" : "default"}
                        disabled={pending}
                        onClick={() => startTransition(async () => {
                            await onConfirm();
                            setOpen(false);
                        })}
                    >
                        {confirmLabel ?? t("confirm")}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
