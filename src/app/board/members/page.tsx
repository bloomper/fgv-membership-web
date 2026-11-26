import { getFormatter, getTranslations } from "next-intl/server";
import Link from "next/link";
import { requireRole } from "@/lib/guard";
import { listMembers, memberTrend, searchSpexare } from "@/lib/board";

const STATUSES = ["PAID", "WAIVED", "PENDING", "REPORTED", "CANCELLED"];
const HOWS = ["SWISH", "BANK_TRANSFER", "CASH", "ONLINE", "WAIVED", "REVIVAL", "MIGRATED"];

export default async function MembersPage({ searchParams }: { searchParams: Promise<{ year?: string; status?: string; how?: string; last?: string; q?: string }> }) {
  const viewer = await requireRole("BOARD", "/board/members");
  const t = await getTranslations("members");
  const format = await getFormatter();
  const { year: yearParam, status, how, last, q } = await searchParams;
  const year = Number(yearParam) || new Date().getFullYear();
  const [members, trend, found] = await Promise.all([
    listMembers(viewer.accessToken, year, STATUSES.includes(status ?? "") && status !== "PAID" ? status! : null, HOWS.includes(how ?? "") ? how! : null,
      last === "yes" ? true : last === "no" ? false : null),
    memberTrend(viewer.accessToken),
    q ? searchSpexare(viewer.accessToken, q) : Promise.resolve([]),
  ]);
  const current = trend.find((count) => count.year === year);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">{t("title")}</h1>
      <form className="flex flex-wrap items-end gap-2" action="/board/members">
        <label className="text-sm">{t("year")}<input className="input w-24" type="number" name="year" defaultValue={year} /></label>
        <label className="text-sm">{t("status")}
          <select className="input" name="status" defaultValue={status ?? ""}>
            <option value="">{t("counting")}</option>
            {STATUSES.filter((s) => s !== "PAID").map((s) => <option key={s} value={s}>{t(`statuses.${s}`)}</option>)}
          </select>
        </label>
        <label className="text-sm">{t("how")}
          <select className="input" name="how" defaultValue={how ?? ""}>
            <option value="">{t("any")}</option>
            {HOWS.map((h) => <option key={h} value={h}>{t(`hows.${h}`)}</option>)}
          </select>
        </label>
        <label className="text-sm">{t("lastYear")}
          <select className="input" name="last" defaultValue={last ?? ""}>
            <option value="">{t("any")}</option>
            <option value="yes">{t("wasMember")}</option>
            <option value="no">{t("wasNotMember")}</option>
          </select>
        </label>
        <button className="button" type="submit">{t("filter")}</button>
      </form>

      <section className="space-y-1">
        <h2 className="font-semibold">{t("counts")}</h2>
        {current && <p>{t("summary", { year, members: current.members, lifetime: current.lifetime, joined: current.joined })}</p>}
        <p className="text-sm">
          <a className="underline" href={`/board/export/members?year=${year}`}>{t("exportMembers")}</a>
          {" · "}<Link className="underline" href="/board/renewals">{t("renewals")}</Link>
        </p>
        <table className="text-left text-sm">
          <thead><tr><th className="pr-4">{t("year")}</th><th className="pr-4">{t("membersHeader")}</th><th className="pr-4">{t("lifetimeHeader")}</th><th>{t("joinedHeader")}</th></tr></thead>
          <tbody>
            {[...trend].reverse().map((count) => (
              <tr key={count.year}><td className="pr-4"><Link className="underline" href={`/board/members?year=${count.year}`}>{count.year}</Link></td>
                <td className="pr-4">{format.number(count.members)}</td><td className="pr-4">{format.number(count.lifetime)}</td><td>{format.number(count.joined)}</td></tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="space-y-2">
        <h2 className="font-semibold">{t("findSpexare")}</h2>
        <form className="flex gap-2" action="/board/members">
          <input type="hidden" name="year" value={year} />
          <input className="input max-w-xs" type="search" name="q" defaultValue={q} placeholder={t("searchName")} aria-label={t("searchName")} />
          <button className="button-secondary" type="submit">{t("search")}</button>
        </form>
        {found.length > 0 && (
          <ul className="space-y-1">
            {found.map((person) => <li key={person.id}><Link className="underline" href={`/board/members/${person.id}`}>{person.firstName} {person.lastName}</Link></li>)}
          </ul>
        )}
      </section>

      <section className="space-y-2">
        <h2 className="font-semibold">{t("list", { year, count: members.length })}</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead><tr className="border-b border-zinc-200 dark:border-zinc-800"><th className="py-2 pr-4">{t("name")}</th><th className="py-2 pr-4">{t("status")}</th><th className="py-2 pr-4">{t("how")}</th><th className="py-2">{t("note")}</th></tr></thead>
            <tbody>
              {members.map((member) => (
                <tr key={member.membershipId} className="border-b border-zinc-100 dark:border-zinc-900">
                  <td className="py-1 pr-4"><Link className="underline" href={`/board/members/${member.spexareId}`}>{member.name ?? member.spexareId}</Link>
                    {member.lifetime && <span> ({t("lifetimeFrom", { year: member.year })})</span>}{member.family && <span> ({t("family")})</span>}{member.optedOut && <span> ({t("optedOut")})</span>}</td>
                  <td className="py-1 pr-4">{t(`statuses.${member.status}`)}</td>
                  <td className="py-1 pr-4">{member.how ? t(`hows.${member.how}`) : ""}</td>
                  <td className="py-1">{member.note ?? ""}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
