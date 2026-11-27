import Link from "next/link";
import {getTranslations} from "next-intl/server";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@bloomper/fgv-web-ui/ui/table";
import {AUDIT_PAGE_SIZE, getAuditLog} from "@/lib/audit/audit.server";
import {formatInstant} from "@/utils/format";
import {Policies} from "@/utils/policy.server";
import {withPolicyPage} from "@/utils/route.server";
import {Page, PageHeader} from "@bloomper/fgv-web-ui/shell/page-header";

/** Who changed what, newest first, including changes to users' access. */
export default async function AuditPage({searchParams}: { searchParams: Promise<{ page?: string }> }) {
    return withPolicyPage(Policies.admin.requireAdmin, async () => {
        const t = await getTranslations("Audit");
        const page = Math.max(1, Number((await searchParams).page) || 1);
        const lines = await getAuditLog((page - 1) * AUDIT_PAGE_SIZE, AUDIT_PAGE_SIZE);

        return (
            <Page>
                <PageHeader title={t("title")} description={t("intro")}/>
                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>{t("when")}</TableHead>
                                <TableHead>{t("who")}</TableHead>
                                <TableHead>{t("what")}</TableHead>
                                <TableHead>{t("subject")}</TableHead>
                                <TableHead>{t("detail")}</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {lines.map((line, index) => (
                                <TableRow key={`${line.at}-${index}`} className="align-top">
                                    <TableCell>{formatInstant(line.at)}</TableCell>
                                    <TableCell>{line.actorName || line.actor}</TableCell>
                                    <TableCell className="font-mono text-xs">{line.action}</TableCell>
                                    <TableCell className="break-all whitespace-normal">{line.subject ?? ""}</TableCell>
                                    <TableCell className="whitespace-normal">{line.detail ?? ""}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
                <p className="flex gap-4">
                    {page > 1 && <Link className="text-link hover:text-link/80" href={`/admin/audit?page=${page - 1}`}>{t("newer")}</Link>}
                    {lines.length === AUDIT_PAGE_SIZE && <Link className="text-link hover:text-link/80" href={`/admin/audit?page=${page + 1}`}>{t("older")}</Link>}
                </p>
            </Page>
        );
    });
}
