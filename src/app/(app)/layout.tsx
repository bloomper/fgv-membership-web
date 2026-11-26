import * as React from "react";
import {cookies} from "next/headers";
import Link from "next/link";
import {redirect} from "next/navigation";
import {getTranslations} from "next-intl/server";
import {AppSidebar} from "@/components/app-sidebar.client";
import {RolesProvider} from "@/components/roles-provider.client";
import {SiteHeader} from "@/components/site-header.client";
import {getApplications} from "@/utils/applications.server";
import {SidebarInset, SidebarProvider} from "@/components/ui/sidebar";
import {Button} from "@/components/ui/button";
import {PublicHeader} from "@/components/public-header";
import {LogoHome} from "@/components/logo-home";
import {requireUser} from "@/utils/auth.server";
import {hasAccess, SSO_CHECKED_COOKIE} from "@/utils/auth";

export const instant = false;

export default async function AppLayout({children}: { children: React.ReactNode }) {
    const {session, roles} = await requireUser();
    const t = await getTranslations();

    if (!session) {
        // Someone logged in to another FGV application gets in without pressing the login button
        if (!(await cookies()).has(SSO_CHECKED_COOKIE)) {
            redirect("/api/auth/login?silent=1");
        }

        return (
            <div className="min-h-dvh bg-background flex flex-col">
                <PublicHeader/>

                <main className="flex-1 flex items-center">
                    <div className="mx-auto w-full max-w-5xl px-4 py-10">
                        <div className="space-y-4 text-center">
                            <div className="mx-auto flex justify-center">
                                <div className="h-20 w-20 text-foreground sm:h-24 sm:w-24">
                                    <LogoHome/>
                                </div>
                            </div>

                            <h1 className="text-3xl font-semibold tracking-tight sm:text-5xl">
                                {t("Home.title")}
                            </h1>

                            <p className="mx-auto mt-3 max-w-prose text-sm text-muted-foreground">
                                {t("Home.mustBeLoggedIn")}
                            </p>

                            <div className="pt-2">
                                <Button nativeButton={false}
                                        render={<a href="/api/auth/login"/>}>{t("Common.login")}</Button>
                                <Button nativeButton={false} variant="outline" className="ml-2"
                                        render={<Link href="/register"/>}>{t("Common.register")}</Button>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        );
    }

    if (!hasAccess(roles)) {
        redirect("/no-access");
    }

    const accountUrl = `${(process.env.KEYCLOAK_ISSUER ?? "").replace(/\/$/, "")}/account`;
    const applications = await getApplications();

    return (
        <div className="[--header-height:calc(--spacing(14))]">
            <RolesProvider roles={roles}>
                <SidebarProvider className="flex flex-col">
                    <SiteHeader applications={applications}/>
                    <div className="flex flex-1">
                        <AppSidebar roles={roles} accountUrl={accountUrl}/>
                        <SidebarInset className="min-w-0">
                            {children}
                        </SidebarInset>
                    </div>
                </SidebarProvider>
            </RolesProvider>
        </div>
    );
}
