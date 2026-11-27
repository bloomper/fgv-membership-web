"use client";

import * as React from "react";
import { useMemo } from "react";
import { IdCard, type LucideIcon, Wrench } from "lucide-react";

import { NavMain } from "@bloomper/fgv-web-ui/shell/nav-main";
import { NavSecondary, SidebarBrand } from "@bloomper/fgv-web-ui/shell/sidebar-parts";
import { NavUser } from "@/components/nav-user.client";
import { Sidebar, SidebarContent, SidebarFooter, useSidebar } from "@bloomper/fgv-web-ui/ui/sidebar";
import { Role } from "@/types/auth";
import { GROUPS, HOME, MEMBERSHIP } from "@/utils/navigation";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { useIsClient } from "@bloomper/fgv-web-ui/hooks/use-is-client";

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

export function AppSidebar({ roles, accountUrl, ...props }: AppSidebarProps) {
  const pathname = usePathname();
  const t = useTranslations();
  const isClient = useIsClient();
  const { isMobile, setOpenMobile } = useSidebar();

  const closeOnNavigate = (event: React.MouseEvent) => {
    if (isMobile && (event.target as Element).closest("a")) {
      setOpenMobile(false);
    }
  };

  const navigation = useMemo((): { main: NavItem[]; secondary: NavSecondaryItem[] } => {
    const mainItems: NavItem[] = [
      { title: t("Nav.home"), url: HOME.url, icon: HOME.icon, isActive: pathname === "/" },
      {
        title: t("Nav.membership"),
        url: MEMBERSHIP.url,
        icon: MEMBERSHIP.icon,
        isActive: pathname.startsWith("/membership"),
      },
    ];

    for (const group of GROUPS.filter((group) => roles.includes(group.role))) {
      mainItems.push({
        title: t(`Nav.${group.key}`),
        icon: group.icon,
        isActive: group.items.some((item) => pathname.startsWith(item.url)),
        items: group.items.map((item) => ({ title: t(`Nav.${item.key}`), url: item.url })),
      });
    }

    return {
      main: mainItems,
      secondary: [
        { title: t("Support.title"), url: "/support", icon: Wrench },
        { title: t("About.title"), url: "/about", icon: IdCard },
      ],
    };
  }, [roles, pathname, t]);

  return (
    <Sidebar
      collapsible="icon"
      className="top-(--header-height) h-[calc(100svh-var(--header-height))]!"
      {...props}
    >
      <SidebarBrand />
      <SidebarContent onClickCapture={closeOnNavigate}>
        {isClient ? (
          <>
            <NavMain items={navigation.main} />
            <NavSecondary
              items={navigation.secondary}
              className="mt-auto"
            />
          </>
        ) : (
          <div className="flex flex-col gap-2 p-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="flex items-center gap-3 px-2 py-1.5"
              >
                <div className="bg-sidebar-accent/50 size-4 shrink-0 animate-pulse rounded" />
                <div className="bg-sidebar-accent/50 h-3 w-24 animate-pulse rounded group-data-[collapsible=icon]:hidden" />
              </div>
            ))}
          </div>
        )}
      </SidebarContent>
      <SidebarFooter onClickCapture={closeOnNavigate}>{isClient && <NavUser accountUrl={accountUrl} />}</SidebarFooter>
    </Sidebar>
  );
}
