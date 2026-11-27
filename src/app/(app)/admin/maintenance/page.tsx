import {getTranslations} from "next-intl/server";
import {Card, CardContent} from "@/components/ui/card";
import {RunJobButton} from "@/components/admin/run-job-button.client";
import {getMaintenanceJobs} from "@/lib/maintenance/maintenance.server";
import {formatInstant} from "@/utils/format";
import {Policies} from "@/utils/policy.server";
import {withPolicyPage} from "@/utils/route.server";

/** The jobs that run by themselves on a schedule, and a way to run one now. */
export default async function MaintenancePage() {
    return withPolicyPage(Policies.admin.requireAdmin, async () => {
        const t = await getTranslations("Maintenance");
        const jobs = await getMaintenanceJobs();

        return (
            <div className="flex flex-1 flex-col gap-4 p-4 md:p-8">
                <h1 className="text-2xl font-bold tracking-tight">{t("title")}</h1>
                <p className="max-w-prose text-sm text-muted-foreground">{t("intro")}</p>
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
            </div>
        );
    });
}
