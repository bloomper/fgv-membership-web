import { getTranslations } from "next-intl/server";
import Link from "next/link";
import { requireRole } from "@/lib/guard";
import { graphql } from "@/lib/graphql";
import { searchSpexare } from "@/lib/board";
import { AttachForm } from "./attach-form";

type Request = { id: string; reference: string; familyNote: string | null; familyMembers: { id: string; firstName: string; lastName: string }[]; memberships: { year: number }[] };

export default async function FamilyPage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ q?: string }> }) {
  const { id } = await params;
  const { q } = await searchParams;
  const viewer = await requireRole("BOARD", `/board/requests/${id}/family`);
  const t = await getTranslations("family");
  const data = await graphql<{ paymentRequest: Request }>(viewer.accessToken,
    `query ($id: ID!) { paymentRequest(id: $id) { id reference familyNote memberships { year } familyMembers { id firstName lastName } } }`, { id });
  const request = data.paymentRequest;
  const found = q ? await searchSpexare(viewer.accessToken, q) : [];
  const have = new Set(request.familyMembers.map((person) => person.id));

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">{t("title", { reference: request.reference })}</h1>
      {request.familyNote && <p className="text-sm">{t("saidByPayer")}: <em>{request.familyNote}</em></p>}
      <section className="space-y-1">
        <h2 className="font-semibold">{t("members")}</h2>
        <ul>{request.familyMembers.map((person) => <li key={person.id}>{person.firstName} {person.lastName}</li>)}</ul>
      </section>
      <section className="space-y-2">
        <h2 className="font-semibold">{t("add")}</h2>
        <form className="flex gap-2" action={`/board/requests/${id}/family`}>
          <input className="input max-w-xs" type="search" name="q" defaultValue={q} placeholder={t("searchName")} aria-label={t("searchName")} />
          <button className="button-secondary" type="submit">{t("search")}</button>
        </form>
        {found.length > 0 && (
          <AttachForm requestId={id} people={found.filter((person) => !have.has(person.id)).map((person) => ({ id: person.id, name: `${person.firstName} ${person.lastName}` }))}
                      labels={{ add: t("addSelected") }} />
        )}
      </section>
      <p><Link className="underline" href="/treasurer/payments">{t("back")}</Link></p>
    </div>
  );
}
