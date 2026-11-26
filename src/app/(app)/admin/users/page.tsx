import Link from "next/link";
import {getTranslations} from "next-intl/server";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {NativeSelect, NativeSelectOption} from "@/components/ui/native-select";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {listUsers, USER_STATUSES} from "@/lib/users/users.server";
import {formatDate} from "@/utils/format";
import {Policies} from "@/utils/policy.server";
import {withPolicyPage} from "@/utils/route.server";

const PAGE = 25;

/** The accounts of FGV's applications; Keycloak pages through them, so the page does too. */
export default async function UsersPage({searchParams}: { searchParams: Promise<{ q?: string; status?: string; page?: string }> }) {
    return withPolicyPage(Policies.admin.requireAdmin, async () => {
        const t = await getTranslations("Users");
        const {q = "", status, page} = await searchParams;
        const selected = USER_STATUSES.find(candidate => candidate === status);
        const current = Math.max(1, Number(page) || 1);
        const users = await listUsers(q, selected, (current - 1) * PAGE, PAGE);
        const pages = Math.max(1, Math.ceil((users?.total ?? 0) / PAGE));
        const link = (p: number) => `/admin/users?${new URLSearchParams({...(q ? {q} : {}), ...(selected ? {status: selected} : {}), page: String(p)})}`;

        return (
            <div className="flex flex-1 flex-col gap-4 p-4 md:p-8">
                <h1 className="text-2xl font-bold tracking-tight">{t("title")}</h1>
                <form className="flex flex-wrap gap-2" action="/admin/users">
                    <Input className="max-w-xs" type="search" name="q" defaultValue={q} placeholder={t("search")} aria-label={t("search")}/>
                    <NativeSelect name="status" defaultValue={selected ?? ""} aria-label={t("status")}>
                        <NativeSelectOption value="">{t("allStatuses")}</NativeSelectOption>
                        {USER_STATUSES.map(s => <NativeSelectOption key={s} value={s}>{t(`statuses.${s}`)}</NativeSelectOption>)}
                    </NativeSelect>
                    <Button type="submit">{t("filter")}</Button>
                </form>
                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>{t("name")}</TableHead>
                                <TableHead>{t("email")}</TableHead>
                                <TableHead>{t("status")}</TableHead>
                                <TableHead>{t("registered")}</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {users?.items.map(user => (
                                <TableRow key={user.id}>
                                    <TableCell><Link className="underline underline-offset-4" href={`/admin/users/${user.id}`}>{user.displayName}</Link></TableCell>
                                    <TableCell>{user.email}</TableCell>
                                    <TableCell>{t(`statuses.${user.status}`)}</TableCell>
                                    <TableCell>{formatDate(user.createdAt)}</TableCell>
                                </TableRow>
                            ))}
                            {users?.items.length === 0 && <TableRow><TableCell colSpan={4} className="h-16 text-center">{t("none")}</TableCell></TableRow>}
                        </TableBody>
                    </Table>
                </div>
                {pages > 1 && (
                    <nav className="flex items-center gap-3 text-sm" aria-label={t("pages")}>
                        {current > 1 && <Link className="underline underline-offset-4" href={link(current - 1)}>{t("previous")}</Link>}
                        <span>{current} / {pages}</span>
                        {current < pages && <Link className="underline underline-offset-4" href={link(current + 1)}>{t("next")}</Link>}
                    </nav>
                )}
            </div>
        );
    });
}
