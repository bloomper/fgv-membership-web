"use client";

import * as React from "react";
import {useCallback, useEffect, useMemo, useState} from "react";
import {useRouter} from "next/navigation";
import {useTranslations} from "next-intl";
import {Command as CommandIcon, IdCard, type LucideIcon, Wrench} from "lucide-react";

import {Command, CommandGroup, CommandInput, CommandItem, CommandList} from "@/components/ui/command";
import {Dialog, DialogContent, DialogDescription, DialogTitle} from "@/components/ui/dialog";
import {Button} from "@/components/ui/button";
import {useRoles} from "@/components/roles-provider.client";
import {GROUPS, HOME, MEMBERSHIP} from "@/utils/navigation";
import {track} from "@/utils/umami";

type PaletteEntry = {
    id: string;
    label: string;
    href: string;
    icon: LucideIcon;
};

const normalize = (value: string) => value.trim().toLowerCase();

export function CommandPalette() {
    const t = useTranslations();
    const router = useRouter();
    const roles = useRoles();

    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState("");

    useEffect(() => {
        const onKeyDown = (event: KeyboardEvent) => {
            if (event.key.toLowerCase() === "k" && (event.metaKey || event.ctrlKey)) {
                event.preventDefault();
                setOpen((previous) => !previous);
            }
        };

        window.addEventListener("keydown", onKeyDown);
        return () => window.removeEventListener("keydown", onKeyDown);
    }, []);

    const navigation = useMemo(() => {
        const entries: PaletteEntry[] = [
            {id: "home", label: t("Nav.home"), href: HOME.url, icon: HOME.icon},
            {id: "membership", label: t("Nav.membership"), href: MEMBERSHIP.url, icon: MEMBERSHIP.icon},
        ];

        for (const group of GROUPS.filter(group => roles.includes(group.role))) {
            for (const item of group.items) {
                entries.push({id: item.key, label: t(`Nav.${item.key}`), href: item.url, icon: item.icon});
            }
        }
        entries.push(
            {id: "support", label: t("Support.title"), href: "/support", icon: Wrench},
            {id: "about", label: t("About.title"), href: "/about", icon: IdCard},
        );
        return entries;
    }, [roles, t]);

    const term = normalize(query);
    const matching = useCallback(
        (entries: PaletteEntry[]) => (term ? entries.filter((entry) => normalize(entry.label).includes(term)) : entries),
        [term],
    );
    const matchingNavigation = matching(navigation);

    const go = useCallback((entry: PaletteEntry) => {
        track("command-palette", {target: entry.id});
        setOpen(false);
        setQuery("");
        router.push(entry.href);
    }, [router]);

    const hasResults = matchingNavigation.length > 0;

    return (
        <>
            <Button
                variant="ghost"
                size="sm"
                className="h-8 gap-2"
                onClick={() => setOpen(true)}
                aria-label={t("CommandPalette.open")}
            >
                <CommandIcon className="h-4 w-4"/>
                <span className="hidden text-xs text-muted-foreground lg:inline">{t("CommandPalette.hint")}</span>
            </Button>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="overflow-hidden p-0" showCloseButton={false}>
                    <DialogTitle className="sr-only">{t("CommandPalette.title")}</DialogTitle>
                    <DialogDescription className="sr-only">{t("CommandPalette.description")}</DialogDescription>
                    <Command shouldFilter={false}>
                        <CommandInput
                            placeholder={t("CommandPalette.placeholder")}
                            value={query}
                            onValueChange={setQuery}
                        />
                        <CommandList>
                            {matchingNavigation.length > 0 && (
                                <CommandGroup heading={t("CommandPalette.navigation")}>
                                    {matchingNavigation.map((entry) => (
                                        <CommandItem key={entry.id} value={entry.id} onSelect={() => go(entry)}>
                                            <entry.icon/>
                                            <span>{entry.label}</span>
                                        </CommandItem>
                                    ))}
                                </CommandGroup>
                            )}

                            {!hasResults && (
                                <div className="py-6 text-center text-sm text-muted-foreground">
                                    {t("CommandPalette.empty")}
                                </div>
                            )}
                        </CommandList>
                    </Command>
                </DialogContent>
            </Dialog>
        </>
    );
}
