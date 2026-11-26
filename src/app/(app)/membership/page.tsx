import Link from "next/link";
import {getTranslations} from "next-intl/server";
import {Badge} from "@/components/ui/badge";
import {Button} from "@/components/ui/button";
import {ApplyForm} from "@/components/membership/apply-form.client";
import {getMyApplication, getMyMembership} from "@/lib/membership/membership.server";
import {requireUser} from "@/utils/auth.server";
import {formatAmount} from "@/utils/format";
import {Policies} from "@/utils/policy.server";
import {withPolicyPage} from "@/utils/route.server";

/**
 * A person's own membership: what they have and what waits for payment, or, for an account that is not linked to a
 * spexare, the application for membership.
 */
export default async function MembershipPage() {
    return withPolicyPage(Policies.app.requireAccess, async () => {
        const t = await getTranslations("Membership");
        const {session} = await requireUser();
        const mine = await getMyMembership();

        if (!mine?.linked) {
            const application = await getMyApplication();

            return (
                <div className="flex flex-1 flex-col gap-4 p-4 md:p-8">
                    <h1 className="text-2xl font-bold tracking-tight">{t("title")}</h1>
                    <p className="max-w-prose text-sm text-muted-foreground">{t("notLinked")}</p>
                    {application?.status === "PENDING" ? (
                        <p role="status" className="font-semibold">{t("applicationPending")}</p>
                    ) : (
                        <>
                            {application?.status === "REJECTED" && (
                                <p role="status">{t("applicationRejected")}{application.decisionMessage ? `: ${application.decisionMessage}` : ""}</p>
                            )}
                            <h2 className="text-lg font-semibold">{t("applyTitle")}</h2>
                            <p className="max-w-prose text-sm text-muted-foreground">{t("applyIntro")}</p>
                            <ApplyForm defaultName={session?.user.name ?? ""}/>
                        </>
                    )}
                </div>
            );
        }

        const waiting = mine.requests.filter(request => request.status === "OPEN" || request.status === "REPORTED");

        return (
            <div className="flex flex-1 flex-col gap-6 p-4 md:p-8">
                <h1 className="text-2xl font-bold tracking-tight">{t("title")}</h1>
                <section className="space-y-3">
                    <h2 className="text-lg font-semibold">{t("memberships")}</h2>
                    {mine.memberships.length === 0 ? <p className="text-sm text-muted-foreground">{t("none")}</p> : (
                        <ul className="space-y-2">
                            {mine.memberships.map(membership => (
                                <li key={membership.id} className="flex flex-wrap items-center gap-2">
                                    <span>{membership.lifetime ? t("lifetimeFrom", {year: membership.year}) : membership.year}</span>
                                    <Badge variant={membership.status === "PAID" || membership.status === "WAIVED" ? "default" : "secondary"}>
                                        {t(`status.${membership.status}`)}
                                    </Badge>
                                </li>
                            ))}
                        </ul>
                    )}
                    <Button nativeButton={false} render={<Link href="/membership/pay"/>}>{t("pay")}</Button>
                </section>
                {waiting.length > 0 && (
                    <section className="space-y-3">
                        <h2 className="text-lg font-semibold">{t("waiting")}</h2>
                        <ul className="space-y-2">
                            {waiting.map(request => (
                                <li key={request.id} className="flex flex-wrap items-center gap-2">
                                    <Link className="underline underline-offset-4" href={`/membership/pay/${request.id}`}>
                                        {request.reference}: {formatAmount(request.amount)}
                                    </Link>
                                    <Badge variant="secondary">{t(`requestStatus.${request.status}`)}</Badge>
                                </li>
                            ))}
                        </ul>
                    </section>
                )}
            </div>
        );
    });
}
