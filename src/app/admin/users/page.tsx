import { getTranslations } from "next-intl/server";
import Link from "next/link";
import { forbidden, redirect } from "next/navigation";
import { listUsers, type UserStatus } from "@/lib/admin";
import { getViewer } from "@/lib/session";
import { hasRole } from "@/lib/roles";

const PAGE = 25;
const STATUSES: UserStatus[] = ["PENDING", "ACTIVE", "DEACTIVATED", "UNVERIFIED"];

export default async function UsersPage({ searchParams }: { searchParams: Promise<{ q?: string; status?: string; page?: string }> }) {
  const viewer = await getViewer();

  if (!viewer) {
    redirect("/api/auth/login?returnTo=/admin/users");
  }
  if (!hasRole(viewer.roles, "ADMIN")) {
    forbidden();
  }

  const t = await getTranslations("admin");
  const { q = "", status, page } = await searchParams;
  const selected = STATUSES.find((s) => s === status);
  const current = Math.max(1, Number(page) || 1);
  const users = await listUsers(viewer.accessToken, q, selected, (current - 1) * PAGE, PAGE);
  const pages = Math.max(1, Math.ceil(users.total / PAGE));
  const link = (p: number) => `/admin/users?${new URLSearchParams({ ...(q ? { q } : {}), ...(selected ? { status: selected } : {}), page: String(p) })}`;

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">{t("users")}</h1>
      <form className="flex flex-wrap gap-2" action="/admin/users">
        <input className="input max-w-xs" type="search" name="q" defaultValue={q} placeholder={t("search")} aria-label={t("search")} />
        <select className="input max-w-48" name="status" defaultValue={selected ?? ""} aria-label={t("status")}>
          <option value="">{t("allStatuses")}</option>
          {STATUSES.map((s) => <option key={s} value={s}>{t(`statuses.${s}`)}</option>)}
        </select>
        <button className="button" type="submit">{t("filter")}</button>
      </form>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-zinc-200 dark:border-zinc-800">
              <th className="py-2 pr-4">{t("name")}</th>
              <th className="py-2 pr-4">{t("email")}</th>
              <th className="py-2 pr-4">{t("status")}</th>
              <th className="py-2">{t("registered")}</th>
            </tr>
          </thead>
          <tbody>
            {users.items.map((user) => (
              <tr key={user.id} className="border-b border-zinc-100 dark:border-zinc-900">
                <td className="py-2 pr-4"><Link className="underline" href={`/admin/users/${user.id}`}>{user.displayName}</Link></td>
                <td className="py-2 pr-4">{user.email}</td>
                <td className="py-2 pr-4">{t(`statuses.${user.status}`)}</td>
                <td className="py-2">{user.createdAt ? user.createdAt.slice(0, 10) : ""}</td>
              </tr>
            ))}
            {users.items.length === 0 && <tr><td className="py-4" colSpan={4}>{t("none")}</td></tr>}
          </tbody>
        </table>
      </div>
      {pages > 1 && (
        <nav className="flex items-center gap-3 text-sm" aria-label={t("pages")}>
          {current > 1 && <Link className="underline" href={link(current - 1)}>{t("previous")}</Link>}
          <span>{current} / {pages}</span>
          {current < pages && <Link className="underline" href={link(current + 1)}>{t("next")}</Link>}
        </nav>
      )}
    </div>
  );
}
