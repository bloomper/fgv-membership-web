"use client";

import * as React from "react";
import {useMemo} from "react";
import {IdCard, type LucideIcon, Wrench} from "lucide-react";

import {NavMain} from "@/components/nav-main.client";
import {NavSecondary} from "@/components/nav-secondary.client";
import {NavUser} from "@/components/nav-user.client";
import {SidebarToggle} from "@/components/sidebar-toggle.client";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar
} from "@/components/ui/sidebar";
import {Logo} from "@/components/logo";
import {LogoText} from "@/components/logo-text";
import {Role} from "@/types/auth";
import {GROUPS, HOME, MEMBERSHIP} from "@/utils/navigation";
import {usePathname} from "next/navigation";
import {useTranslations} from "next-intl";
import {useIsClient} from "@/hooks/use-is-client.client";

interface NavLink {
    title: string;
    url: string;
    icon?: LucideIcon;
    isActive?: boolean;
    items?: NavLink[];
}

/** A group without an address only opens and closes its entries. */
interface NavItem extends Omit<NavLink, "url"> {
    url?: string;
}

interface NavSecondaryItem extends Omit<NavLink, "icon"> {
    icon: LucideIcon;
}

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
    roles: Role[];
    accountUrl: string;
}

export function AppSidebar({roles, accountUrl, ...props}: AppSidebarProps) {
    const pathname = usePathname();
    const t = useTranslations();
    const isClient = useIsClient();
    const {isMobile, setOpenMobile} = useSidebar();

    const closeOnNavigate = (event: React.MouseEvent) => {
        if (isMobile && (event.target as Element).closest("a")) {
            setOpenMobile(false);
        }
    };

    const navigation = useMemo((): { main: NavItem[]; secondary: NavSecondaryItem[] } => {
        const mainItems: NavItem[] = [
            {title: t("Nav.home"), url: HOME.url, icon: HOME.icon, isActive: pathname === "/"},
            {
                title: t("Nav.membership"),
                url: MEMBERSHIP.url,
                icon: MEMBERSHIP.icon,
                isActive: pathname.startsWith("/membership"),
            },
        ];

        for (const group of GROUPS.filter(group => roles.includes(group.role))) {
            mainItems.push({
                title: t(`Nav.${group.key}`),
                icon: group.icon,
                isActive: group.items.some(item => pathname.startsWith(item.url)),
                items: group.items.map(item => ({title: t(`Nav.${item.key}`), url: item.url})),
            });
        }

        return {
            main: mainItems,
            secondary: [
                {title: t("Support.title"), url: "/support", icon: Wrench},
                {title: t("About.title"), url: "/about", icon: IdCard},
            ],
        };
    }, [roles, pathname, t]);

    return (
        <Sidebar collapsible="icon"
                 className="top-(--header-height) h-[calc(100svh-var(--header-height))]!"
                 {...props}
        >
            <SidebarHeader className="flex-row items-center group-data-[collapsible=icon]:flex-col">
                <SidebarMenu className="min-w-0 flex-1">
                    <SidebarMenuItem>
                        <SidebarMenuButton
                            size="lg"
                            render={
                                <a
                                    href="https://www.fgv.nu"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-3 flex-nowrap bg-transparent! hover:bg-transparent! active:bg-transparent! focus:bg-transparent!"
                                />
                            }
                        >
                            <div
                                className="flex aspect-square size-10 shrink-0 items-center justify-center rounded-lg group-data-[collapsible=icon]:size-8">
                                <Logo/>
                            </div>
                            <div className="min-w-0 flex-1 overflow-hidden pl-1">
                                <LogoText className="h-10 w-auto text-foreground"/>
                            </div>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
                <SidebarToggle/>
            </SidebarHeader>
            <SidebarContent onClickCapture={closeOnNavigate}>
                {isClient ? (
                    <>
                        <NavMain items={navigation.main}/>
                        <NavSecondary items={navigation.secondary} className="mt-auto"/>
                    </>
                ) : (
                    <div className="flex flex-col gap-2 p-4">
                        {Array.from({length: 3}).map((_, i) => (
                            <div key={i} className="flex items-center gap-3 px-2 py-1.5">
                                <div className="size-4 shrink-0 animate-pulse rounded bg-sidebar-accent/50"/>
                                <div
                                    className="h-3 w-24 animate-pulse rounded bg-sidebar-accent/50 group-data-[collapsible=icon]:hidden"/>
                            </div>
                        ))}
                    </div>
                )}
            </SidebarContent>
            <SidebarFooter onClickCapture={closeOnNavigate}>
                {isClient && <NavUser accountUrl={accountUrl}/>}
            </SidebarFooter>
        </Sidebar>
    );
}
