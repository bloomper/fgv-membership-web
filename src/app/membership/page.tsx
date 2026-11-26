import { getFormatter, getTranslations } from "next-intl/server";
import Link from "next/link";
import { requireRole } from "@/lib/guard";
import { myApplication, myMembership } from "@/lib/payment";
import { ApplyForm } from "./apply/apply-form";

export default async function MyMembershipPage() {
  const viewer = await requireRole("USER", "/membership");
  const t = await getTranslations("membership");
  const format = await getFormatter();
  const mine = await myMembership(viewer.accessToken);

  if (!mine.linked) {
    const application = await myApplication(viewer.accessToken);

    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-semibold">{t("title")}</h1>
        <p>{t("notLinked")}</p>
        {application?.status === "PENDING" ? <p role="status" className="font-semibold">{t("applicationPending")}</p> : (
          <>
            {application?.status === "REJECTED" && <p role="status">{t("applicationRejected")}{application.decisionMessage ? `: ${application.decisionMessage}` : ""}</p>}
            <h2 className="font-semibold">{t("applyTitle")}</h2>
            <p className="text-sm">{t("applyIntro")}</p>
            <ApplyForm defaultName={viewer.name} labels={{ name: t("applyName"), text: t("applyText"), hint: t("applyHint"), submit: t("applySubmit") }} />
          </>
        )}
      </div>
    );
  }

  const waiting = mine.requests.filter((request) => request.status === "OPEN" || request.status === "REPORTED");

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">{t("title")}</h1>
      <section className="space-y-2">
        <h2 className="font-semibold">{t("memberships")}</h2>
        {mine.memberships.length === 0 ? <p>{t("none")}</p> : (
          <ul className="space-y-1">
            {mine.memberships.map((membership) => (
              <li key={membership.id}>
                {membership.lifetime ? t("lifetimeFrom", { year: membership.year }) : membership.year} – {t(`status.${membership.status}`)}
              </li>
            ))}
          </ul>
        )}
        <p><Link className="button" href="/membership/pay">{t("pay")}</Link></p>
      </section>
      {waiting.length > 0 && (
        <section className="space-y-2">
          <h2 className="font-semibold">{t("waiting")}</h2>
          <ul className="space-y-1">
            {waiting.map((request) => (
              <li key={request.id}>
                <Link className="underline" href={`/membership/pay/${request.id}`}>
                  {request.reference}: {format.number(request.amount)} kr
                </Link>{" "}
                – {t(`requestStatus.${request.status}`)}
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
