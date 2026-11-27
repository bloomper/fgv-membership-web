import Link from "next/link";
import {getTranslations} from "next-intl/server";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {Policies} from "@/utils/policy.server";
import {withPolicyPage} from "@/utils/route.server";
import {requireUser} from "@/utils/auth.server";
import {GROUPS, MEMBERSHIP} from "@/utils/navigation";

/**
 * The start page: a card for each part of Medlemskap the user may open.
 */
export default async function HomePage() {
    return withPolicyPage(Policies.app.requireAccess, async ({roles}) => {
        const t = await getTranslations("Home");
        const {session} = await requireUser();
        const cards = [
            {key: "membership", url: MEMBERSHIP.url, icon: MEMBERSHIP.icon},
            ...GROUPS.filter(group => roles.includes(group.role))
                .map(group => ({key: group.key, url: group.items[0].url, icon: group.icon})),
        ];

        return (
            <div className="flex flex-1 flex-col gap-6 p-4 md:p-8">
                <div className="space-y-1">
                    <h1 className="text-2xl font-bold tracking-tight">{t("welcome", {name: session?.user.name ?? ""})}</h1>
                    <p className="max-w-prose text-sm text-muted-foreground">{t("intro")}</p>
                </div>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {cards.map(({key, url, icon: Icon}) => (
                        <Link key={key} href={url} className="rounded-xl focus-visible:outline-2 focus-visible:outline-ring">
                            <Card className="h-full transition-colors hover:bg-accent">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2"><Icon className="size-4"/>{t(`${key}Title`)}</CardTitle>
                                    <CardDescription>{t(`${key}Text`)}</CardDescription>
                                </CardHeader>
                                <CardContent/>
                            </Card>
                        </Link>
                    ))}
                </div>
            </div>
        );
    });
}
