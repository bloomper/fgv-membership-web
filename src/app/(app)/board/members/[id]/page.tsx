import Link from "next/link";
import { getLocale, getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { Badge } from "@bloomper/fgv-web-ui/ui/badge";
import { Button } from "@bloomper/fgv-web-ui/ui/button";
import { RecordWithoutRequestForm, SendLinkForm, WaiverForm } from "@/components/members/member-forms.client";
import { getFeeLevels } from "@/lib/membership/membership.server";
import { getMemberDetail } from "@/lib/members/members.server";
import { formatAmount, formatInstant } from "@/utils/format";
import { Policies } from "@/utils/policy.server";
import { withPolicyPage } from "@/utils/route.server";
import { Page, PageHeader } from "@bloomper/fgv-web-ui/shell/page-header";

/** A member: memberships over the years, requests, the emails sent, and what the board may do for them. */
export default async function MemberPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return withPolicyPage(Policies.board.requireBoard, async ({ roles }) => {
    const t = await getTranslations("Member");
    const tm = await getTranslations("Members");
    const locale = await getLocale();
    const [detail, fees] = await Promise.all([getMemberDetail(id), getFeeLevels()]);

    if (!detail) {
      notFound();
    }

    const spexregister = process.env.SPEXREGISTER_WEB_URL?.trim().replace(/\/+$/, "");
    const options = fees.map((fee) => ({
      id: fee.id,
      label: `${locale === "sv" ? fee.nameSv : fee.nameEn}${fee.lifetime ? ` (${t("forLife")})` : ` ${fee.year}`}: ${formatAmount(fee.amount)}`,
    }));
    const today = new Date().toISOString().slice(0, 10);

    return (
      <Page variant="content">
        <PageHeader
          title={`${detail.spexare.firstName} ${detail.spexare.lastName}`}
          description={
            <>
              {detail.spexare.email}
              {detail.optedOut && ` · ${tm("optedOut")}`}
              {spexregister && (
                <>
                  {" "}
                  ·{" "}
                  <a
                    className="text-link hover:text-link/80"
                    href={`${spexregister}/spexare/${id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {t("inSpexregister")}
                  </a>
                </>
              )}
            </>
          }
        />

        <section className="space-y-2">
          <h2 className="text-lg font-semibold">{t("memberships")}</h2>
          {detail.memberships.length === 0 ? (
            <p className="text-muted-foreground text-sm">{t("none")}</p>
          ) : (
            <ul className="space-y-1">
              {detail.memberships.map((m) => (
                <li
                  key={m.id}
                  className="flex flex-wrap items-center gap-2"
                >
                  {m.lifetime ? tm("lifetimeFrom", { year: m.year }) : m.year}
                  <Badge variant={m.status === "PAID" || m.status === "WAIVED" ? "default" : "secondary"}>
                    {tm(`statuses.${m.status}`)}
                  </Badge>
                  {m.how && <span className="text-muted-foreground text-sm">{tm(`hows.${m.how}`)}</span>}
                  {m.note && <span className="text-muted-foreground text-sm">({m.note})</span>}
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-semibold">{t("requests")}</h2>
          {detail.requests.length === 0 ? (
            <p className="text-muted-foreground text-sm">{t("none")}</p>
          ) : (
            <ul className="space-y-1">
              {detail.requests.map((r) => (
                <li key={r.id}>
                  <span className="font-mono">{r.reference}</span> – {formatAmount(r.amount)} (
                  {t("paid", { paid: r.paid })}) – {t(`requestStatus.${r.status}`)} –{" "}
                  {r.memberships.map((m) => m.year).join(", ")}
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-semibold">{t("emails")}</h2>
          {detail.emails.length === 0 ? (
            <p className="text-muted-foreground text-sm">{t("none")}</p>
          ) : (
            <ul className="space-y-1">
              {detail.emails.map((e) => (
                <li key={e.sentAt}>
                  {formatInstant(e.sentAt)} – {t(`emailKinds.${e.kind}`)}
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-semibold">{t("waiver")}</h2>
          <p className="text-muted-foreground max-w-prose text-sm">{t("waiverIntro")}</p>
          <WaiverForm
            spexareId={id}
            year={new Date().getFullYear()}
          />
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-semibold">{t("sendLink")}</h2>
          <p className="text-muted-foreground max-w-prose text-sm">{t("sendLinkIntro")}</p>
          <SendLinkForm
            spexareId={id}
            options={options}
          />
        </section>

        {roles.includes("TREASURER") && (
          <section className="space-y-2">
            <h2 className="text-lg font-semibold">{t("record")}</h2>
            <p className="text-muted-foreground max-w-prose text-sm">{t("recordIntro")}</p>
            <RecordWithoutRequestForm
              spexareId={id}
              options={options}
              today={today}
            />
          </section>
        )}
        <div>
          <Button
            variant="outline"
            nativeButton={false}
            render={<Link href="/board/members" />}
          >
            {t("back")}
          </Button>
        </div>
      </Page>
    );
  });
}
