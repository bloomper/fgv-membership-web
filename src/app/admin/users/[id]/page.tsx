import { getTranslations } from "next-intl/server";
import Link from "next/link";
import { forbidden, notFound, redirect } from "next/navigation";
import { getUser } from "@/lib/admin";
import { GraphQLRequestError } from "@/lib/graphql";
import { getViewer } from "@/lib/session";
import { hasRole } from "@/lib/roles";
import { AccessForm, ActionButton, RejectForm } from "./controls";

export default async function UserPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const viewer = await getViewer();

  if (!viewer) {
    redirect(`/api/auth/login?returnTo=/admin/users/${id}`);
  }
  if (!hasRole(viewer.roles, "ADMIN")) {
    forbidden();
  }

  const user = await getUser(viewer.accessToken, id).catch((error) => {
    if (error instanceof GraphQLRequestError) {
      notFound();
    }
    throw error;
  });
  const t = await getTranslations("admin");
  const pending = user.status === "PENDING" || user.status === "UNVERIFIED";

  return (
    <div className="space-y-8">
      <p><Link className="underline" href="/admin/users">← {t("users")}</Link></p>
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold">{user.displayName}</h1>
        <p>{user.email}</p>
        <p className="text-sm">{t(`statuses.${user.status}`)}{user.createdAt ? ` · ${t("registered")} ${user.createdAt.slice(0, 10)}` : ""}</p>
      </header>

      {user.registrationMessage && (
        <section className="space-y-1">
          <h2 className="font-semibold">{t("registrationMessage")}</h2>
          <p className="whitespace-pre-wrap rounded-lg border border-zinc-200 p-3 dark:border-zinc-800">{user.registrationMessage}</p>
        </section>
      )}

      <section className="space-y-3">
        <h2 className="font-semibold">{t("applications")}</h2>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">{t("applicationsHelp")}</p>
        <ul className="divide-y divide-zinc-200 dark:divide-zinc-800">
          {user.access.map((access) => (
            <li key={access.clientId} className="flex flex-wrap items-center gap-3 py-3">
              <div className="min-w-48 flex-1">
                <p className="font-medium">{access.name}</p>
                {!access.consistent && <p className="text-sm text-amber-600">{t("inconsistent")}</p>}
              </div>
              <AccessForm userId={user.id} access={access} labels={{ none: t("noAccess"), save: t("save"), role: t("role"), notify: t("notify") }} />
            </li>
          ))}
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="font-semibold">{t("account")}</h2>
        <div className="flex flex-wrap gap-2">
          <ActionButton userId={user.id} action={user.enabled ? "deactivate" : "activate"} label={user.enabled ? t("deactivate") : t("activate")}
                        confirm={user.enabled ? t("confirmDeactivate") : undefined} />
          {!user.emailVerified && <ActionButton userId={user.id} action="resendVerification" label={t("resendVerification")} />}
          <ActionButton userId={user.id} action="setPassword" label={t("sendSetPassword")} />
          <ActionButton userId={user.id} action="resetPassword" label={t("sendPasswordReset")} />
        </div>
      </section>

      {pending && (
        <section className="space-y-3">
          <h2 className="font-semibold">{t("reject")}</h2>
          <RejectForm userId={user.id} labels={{ message: t("rejectMessage"), submit: t("rejectSubmit"), confirm: t("confirmReject"), notify: t("notify") }} />
        </section>
      )}
    </div>
  );
}
