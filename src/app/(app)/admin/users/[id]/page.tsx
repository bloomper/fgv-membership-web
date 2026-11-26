import Link from "next/link";
import {notFound} from "next/navigation";
import {getTranslations} from "next-intl/server";
import {Badge} from "@/components/ui/badge";
import {AccessForm, RejectForm, UserActionButton} from "@/components/admin/user-controls.client";
import {GraphQLRequestError} from "@/lib/graphql.server";
import {getUser} from "@/lib/users/users.server";
import {formatDate} from "@/utils/format";
import {Policies} from "@/utils/policy.server";
import {withPolicyPage} from "@/utils/route.server";

/** One account: its access to each application, and what an administrator can do with it. */
export default async function UserPage({params}: { params: Promise<{ id: string }> }) {
    const {id} = await params;

    return withPolicyPage(Policies.admin.requireAdmin, async () => {
        const t = await getTranslations("Users");
        const user = await getUser(id).catch(error => {
            if (error instanceof GraphQLRequestError) {
                notFound();
            }
            throw error;
        });

        if (!user) {
            notFound();
        }

        const pending = user.status === "PENDING" || user.status === "UNVERIFIED";

        return (
            <div className="flex flex-1 flex-col gap-8 p-4 md:p-8">
                <p><Link className="underline underline-offset-4" href="/admin/users">← {t("title")}</Link></p>
                <header className="space-y-1">
                    <h1 className="text-2xl font-bold tracking-tight">{user.displayName}</h1>
                    <p>{user.email}</p>
                    <p className="text-sm text-muted-foreground">
                        <Badge variant="secondary">{t(`statuses.${user.status}`)}</Badge>
                        {user.createdAt ? ` ${t("registered")} ${formatDate(user.createdAt)}` : ""}
                    </p>
                </header>

                {user.registrationMessage && (
                    <section className="space-y-1">
                        <h2 className="text-lg font-semibold">{t("registrationMessage")}</h2>
                        <p className="rounded-lg border p-3 whitespace-pre-wrap">{user.registrationMessage}</p>
                    </section>
                )}

                <section className="space-y-3">
                    <h2 className="text-lg font-semibold">{t("applications")}</h2>
                    <p className="max-w-prose text-sm text-muted-foreground">{t("applicationsHelp")}</p>
                    <ul className="divide-y">
                        {user.access.map(access => (
                            <li key={access.clientId} className="flex flex-wrap items-center gap-3 py-3">
                                <div className="min-w-48 flex-1">
                                    <p className="font-medium">{access.name}</p>
                                    {!access.consistent && <p className="text-sm text-amber-600">{t("inconsistent")}</p>}
                                </div>
                                <AccessForm userId={user.id} clientId={access.clientId} ladder={access.ladder} highest={access.highest ?? null}/>
                            </li>
                        ))}
                    </ul>
                </section>

                <section className="space-y-3">
                    <h2 className="text-lg font-semibold">{t("account")}</h2>
                    <div className="flex flex-wrap gap-2">
                        {user.enabled
                            ? <UserActionButton userId={user.id} action="deactivate" label={t("deactivate")} confirm={t("confirmDeactivate")}/>
                            : <UserActionButton userId={user.id} action="activate" label={t("activate")}/>}
                        {!user.emailVerified && <UserActionButton userId={user.id} action="resendVerification" label={t("resendVerification")}/>}
                        <UserActionButton userId={user.id} action="setPassword" label={t("sendSetPassword")}/>
                        <UserActionButton userId={user.id} action="resetPassword" label={t("sendPasswordReset")}/>
                    </div>
                </section>

                {pending && (
                    <section className="space-y-3">
                        <h2 className="text-lg font-semibold">{t("reject")}</h2>
                        <RejectForm userId={user.id}/>
                    </section>
                )}
            </div>
        );
    });
}
