import { getTranslations } from "next-intl/server";
import { requireRole } from "@/lib/guard";
import { maintenanceJobs } from "@/lib/payment";
import { RunButton } from "./run-button";

export default async function MaintenancePage() {
  const viewer = await requireRole("ADMIN", "/admin/maintenance");
  const t = await getTranslations("maintenance");
  const jobs = await maintenanceJobs(viewer.accessToken);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">{t("title")}</h1>
      <p className="text-sm">{t("intro")}</p>
      <ul className="space-y-3">
        {jobs.map((job) => (
          <li key={job.name} className="space-y-1">
            <p><span className="font-semibold">{job.name}</span> – {job.description}</p>
            <p className="text-sm">{job.lastRun ? t("last", { at: job.lastRun.slice(0, 16).replace("T", " "), result: job.lastResult ?? "" }) : t("never")}</p>
            <RunButton name={job.name} label={t("run")} />
          </li>
        ))}
      </ul>
    </div>
  );
}
