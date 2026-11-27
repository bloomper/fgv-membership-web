import {getTranslations} from "next-intl/server";
import {Card, CardContent} from "@bloomper/fgv-web-ui/ui/card";
import {RunJobButton} from "@/components/admin/run-job-button.client";
import {getMaintenanceJobs} from "@/lib/maintenance/maintenance.server";
import {formatInstant} from "@/utils/format";
import {Policies} from "@/utils/policy.server";
import {withPolicyPage} from "@/utils/route.server";
import {Page, PageHeader} from "@bloomper/fgv-web-ui/shell/page-header";

/** The jobs that run by themselves on a schedule, and a way to run one now. */
export default async function MaintenancePage() {
    return withPolicyPage(Policies.admin.requireAdmin, async () => {
        const t = await getTranslations("Maintenance");
        const jobs = await getMaintenanceJobs();

        return (
            <Page>
                <PageHeader title={t("title")} description={t("intro")}/>
                <ul className="space-y-3">
                    {jobs.map(job => (
                        <li key={job.name}>
                            <Card>
                                <CardContent className="space-y-2">
                                    <p><span className="font-semibold">{job.name}</span> – {job.description}</p>
                                    <p className="text-sm text-muted-foreground">
                                        {job.lastRun ? t("last", {at: formatInstant(job.lastRun) ?? job.lastRun, result: job.lastResult ?? ""}) : t("never")}
                                    </p>
                                    <RunJobButton name={job.name}/>
                                </CardContent>
                            </Card>
                        </li>
                    ))}
                </ul>
            </Page>
        );
    });
}
