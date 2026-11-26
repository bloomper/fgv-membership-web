import Link from "next/link";
import {getTranslations} from "next-intl/server";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {NativeSelect, NativeSelectOption} from "@/components/ui/native-select";
import {MembersTable} from "@/components/members/members-table.client";
import {getMemberTrend, listMembers, searchSpexare} from "@/lib/members/members.server";
import {MEMBER_HOWS, MEMBER_STATUSES} from "@/lib/members/schema";
import {Policies} from "@/utils/policy.server";
import {withPolicyPage} from "@/utils/route.server";

type Search = { year?: string; status?: string; how?: string; last?: string; q?: string };

/** The members of a year, how many there have been, and a way to find a person. */
export default async function MembersPage({searchParams}: { searchParams: Promise<Search> }) {
    return withPolicyPage(Policies.board.requireBoard, async () => {
        const t = await getTranslations("Members");
        const {year: yearParam, status, how, last, q} = await searchParams;
        const year = Number(yearParam) || new Date().getFullYear();
        const shownStatus = MEMBER_STATUSES.find(candidate => candidate === status && candidate !== "PAID") ?? null;
        const shownHow = MEMBER_HOWS.find(candidate => candidate === how) ?? null;
        const [members, trend, found] = await Promise.all([
            listMembers(year, shownStatus, shownHow, last === "yes" ? true : last === "no" ? false : null),
            getMemberTrend(),
            q ? searchSpexare(q) : Promise.resolve([]),
        ]);
        const current = trend.find(count => count.year === year);

        return (
            <div className="flex flex-1 flex-col gap-6 p-4 md:p-8">
                <h1 className="text-2xl font-bold tracking-tight">{t("title")}</h1>
                <form className="flex flex-wrap items-end gap-3" action="/board/members">
                    <label className="space-y-1 text-sm">{t("year")}
                        <Input className="w-24" type="number" name="year" defaultValue={year}/>
                    </label>
                    <label className="space-y-1 text-sm">{t("status")}
                        <NativeSelect name="status" defaultValue={shownStatus ?? ""}>
                            <NativeSelectOption value="">{t("counting")}</NativeSelectOption>
                            {MEMBER_STATUSES.filter(candidate => candidate !== "PAID").map(candidate => (
                                <NativeSelectOption key={candidate} value={candidate}>{t(`statuses.${candidate}`)}</NativeSelectOption>
                            ))}
                        </NativeSelect>
                    </label>
                    <label className="space-y-1 text-sm">{t("how")}
                        <NativeSelect name="how" defaultValue={shownHow ?? ""}>
                            <NativeSelectOption value="">{t("any")}</NativeSelectOption>
                            {MEMBER_HOWS.map(candidate => <NativeSelectOption key={candidate} value={candidate}>{t(`hows.${candidate}`)}</NativeSelectOption>)}
                        </NativeSelect>
                    </label>
                    <label className="space-y-1 text-sm">{t("lastYear")}
                        <NativeSelect name="last" defaultValue={last ?? ""}>
                            <NativeSelectOption value="">{t("any")}</NativeSelectOption>
                            <NativeSelectOption value="yes">{t("wasMember")}</NativeSelectOption>
                            <NativeSelectOption value="no">{t("wasNotMember")}</NativeSelectOption>
                        </NativeSelect>
                    </label>
                    <Button type="submit">{t("filter")}</Button>
                </form>

                <section className="space-y-2">
                    <h2 className="text-lg font-semibold">{t("counts")}</h2>
                    {current && <p>{t("summary", {year, members: current.members, lifetime: current.lifetime, joined: current.joined})}</p>}
                    <p className="text-sm">
                        <a className="underline underline-offset-4" href={`/board/export/members?year=${year}`}>{t("exportMembers")}</a>
                        {" · "}
                        <Link className="underline underline-offset-4" href="/board/renewals">{t("renewals")}</Link>
                    </p>
                    <div className="max-w-full overflow-x-auto">
                        <table className="text-left text-sm">
                            <thead>
                            <tr>
                                <th className="pr-4">{t("year")}</th>
                                <th className="pr-4">{t("membersHeader")}</th>
                                <th className="pr-4">{t("lifetimeHeader")}</th>
                                <th>{t("joinedHeader")}</th>
                            </tr>
                            </thead>
                            <tbody>
                            {[...trend].reverse().map(count => (
                                <tr key={count.year}>
                                    <td className="pr-4"><Link className="underline underline-offset-4" href={`/board/members?year=${count.year}`}>{count.year}</Link></td>
                                    <td className="pr-4">{count.members}</td>
                                    <td className="pr-4">{count.lifetime}</td>
                                    <td>{count.joined}</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </section>

                <section className="space-y-2">
                    <h2 className="text-lg font-semibold">{t("findSpexare")}</h2>
                    <form className="flex max-w-md gap-2" action="/board/members">
                        <input type="hidden" name="year" value={year}/>
                        <Input type="search" name="q" defaultValue={q} placeholder={t("searchName")} aria-label={t("searchName")}/>
                        <Button type="submit" variant="outline">{t("search")}</Button>
                    </form>
                    {found.length > 0 && (
                        <ul className="space-y-1">
                            {found.map(person => (
                                <li key={person.id}><Link className="underline underline-offset-4" href={`/board/members/${person.id}`}>{person.firstName} {person.lastName}</Link></li>
                            ))}
                        </ul>
                    )}
                </section>

                <section className="space-y-2">
                    <h2 className="text-lg font-semibold">{t("list", {year, count: members.length})}</h2>
                    <MembersTable rows={members.map(member => ({
                        id: member.membershipId,
                        spexareId: member.spexareId,
                        name: member.name ?? member.spexareId,
                        year: member.year,
                        lifetime: member.lifetime,
                        status: member.status,
                        how: member.how ?? null,
                        note: member.note ?? null,
                        optedOut: member.optedOut,
                        family: member.family,
                        support: member.support,
                    }))}/>
                </section>
            </div>
        );
    });
}
