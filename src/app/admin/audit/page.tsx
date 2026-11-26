import { getTranslations } from "next-intl/server";
import Link from "next/link";
import { requireRole } from "@/lib/guard";
import { auditLog } from "@/lib/payment";

const PAGE = 50;

export default async function AuditPage({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  const viewer = await requireRole("ADMIN", "/admin/audit");
  const t = await getTranslations("audit");
  const page = Math.max(1, Number(((await searchParams).page)) || 1);
  const lines = await auditLog(viewer.accessToken, (page - 1) * PAGE, PAGE);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">{t("title")}</h1>
      <p className="text-sm">{t("intro")}</p>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead><tr className="border-b border-zinc-200 dark:border-zinc-800"><th className="py-2 pr-4">{t("when")}</th><th className="py-2 pr-4">{t("who")}</th><th className="py-2 pr-4">{t("what")}</th><th className="py-2 pr-4">{t("subject")}</th><th className="py-2">{t("detail")}</th></tr></thead>
          <tbody>
            {lines.map((line, index) => (
              <tr key={`${line.at}-${index}`} className="border-b border-zinc-100 align-top dark:border-zinc-900">
                <td className="py-1 pr-4 whitespace-nowrap">{line.at.slice(0, 16).replace("T", " ")}</td>
                <td className="py-1 pr-4">{line.actorName || line.actor}</td>
                <td className="py-1 pr-4 font-mono text-xs">{line.action}</td>
                <td className="py-1 pr-4 break-all">{line.subject ?? ""}</td>
                <td className="py-1">{line.detail ?? ""}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="flex gap-4">
        {page > 1 && <Link className="underline" href={`/admin/audit?page=${page - 1}`}>{t("newer")}</Link>}
        {lines.length === PAGE && <Link className="underline" href={`/admin/audit?page=${page + 1}`}>{t("older")}</Link>}
      </p>
    </div>
  );
}
