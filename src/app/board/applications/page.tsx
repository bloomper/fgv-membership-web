import { getTranslations } from "next-intl/server";
import { requireRole } from "@/lib/guard";
import { searchSpexare } from "@/lib/board";
import { pendingApplications } from "@/lib/payment";
import { DecisionForms } from "./decision-forms";

export default async function ApplicationsPage({ searchParams }: { searchParams: Promise<{ q?: string; app?: string }> }) {
  const viewer = await requireRole("BOARD", "/board/applications");
  const t = await getTranslations("applications");
  const { q, app } = await searchParams;
  const applications = await pendingApplications(viewer.accessToken);
  const found = q ? await searchSpexare(viewer.accessToken, q) : [];

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">{t("title")}</h1>
      <p className="text-sm">{t("intro")}</p>
      {applications.length === 0 ? <p>{t("none")}</p> : (
        <ul className="space-y-4">
          {applications.map((application) => (
            <li key={application.id} className="space-y-2 rounded border border-zinc-200 p-3 dark:border-zinc-800">
              <p className="font-semibold">{application.applicantName} <span className="font-normal">({application.applicantEmail ?? "?"}) – {application.createdAt.slice(0, 10)}</span></p>
              <p className="whitespace-pre-wrap text-sm">{application.text}</p>
              <form className="flex gap-2" action="/board/applications">
                <input type="hidden" name="app" value={application.id} />
                <input className="input max-w-xs" type="search" name="q" defaultValue={app === application.id ? q : ""} placeholder={t("searchName")} aria-label={t("searchName")} />
                <button className="button-secondary" type="submit">{t("search")}</button>
              </form>
              <DecisionForms id={application.id} people={app === application.id ? found.map((person) => ({ id: person.id, name: `${person.firstName} ${person.lastName}${person.email ? ` (${person.email})` : ""}` })) : []}
                             labels={{ pick: t("pick"), create: t("createNew"), accept: t("accept"), message: t("message"), reject: t("reject"), confirmReject: t("confirmReject") }} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
