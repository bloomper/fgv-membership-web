import { getTranslations } from "next-intl/server";
import Link from "next/link";
import { getViewer } from "@/lib/session";
import { hasRole } from "@/lib/roles";

export default async function Home() {
  const t = await getTranslations("home");
  const viewer = await getViewer();

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">{t("title")}</h1>
      {viewer ? (
        <>
          <p>{t("welcome", { name: viewer.name })}</p>
          {hasRole(viewer.roles, "ADMIN") && (
            <p><Link className="underline" href="/admin/users">{t("manageUsers")}</Link></p>
          )}
        </>
      ) : (
        <>
          <p>{t("intro")}</p>
          <div className="flex gap-3">
            <a className="button" href="/api/auth/login">{t("login")}</a>
            <Link className="button-secondary" href="/register">{t("register")}</Link>
          </div>
        </>
      )}
    </div>
  );
}
