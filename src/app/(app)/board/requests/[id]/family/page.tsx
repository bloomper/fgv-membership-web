import Link from "next/link";
import {notFound} from "next/navigation";
import {getTranslations} from "next-intl/server";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {AttachForm} from "@/components/members/attach-form.client";
import {getFamilyRequest, searchSpexare} from "@/lib/members/members.server";
import {Policies} from "@/utils/policy.server";
import {withPolicyPage} from "@/utils/route.server";

/** The people a family request pays for, and a way to add more. */
export default async function FamilyPage({params, searchParams}: { params: Promise<{ id: string }>; searchParams: Promise<{ q?: string }> }) {
    const {id} = await params;
    const {q} = await searchParams;

    return withPolicyPage(Policies.board.requireBoard, async () => {
        const t = await getTranslations("Family");
        const request = await getFamilyRequest(id);

        if (!request) {
            notFound();
        }

        const found = q ? await searchSpexare(q) : [];
        const have = new Set(request.familyMembers.map(person => person.id));

        return (
            <div className="flex flex-1 flex-col gap-4 p-4 md:p-8">
                <h1 className="text-2xl font-bold tracking-tight">{t("title", {reference: request.reference})}</h1>
                {request.familyNote && <p className="text-sm">{t("saidByPayer")}: <em>{request.familyNote}</em></p>}
                <section className="space-y-1">
                    <h2 className="text-lg font-semibold">{t("members")}</h2>
                    <ul>{request.familyMembers.map(person => <li key={person.id}>{person.firstName} {person.lastName}</li>)}</ul>
                </section>
                <section className="space-y-2">
                    <h2 className="text-lg font-semibold">{t("add")}</h2>
                    <form className="flex max-w-md gap-2" action={`/board/requests/${id}/family`}>
                        <Input type="search" name="q" defaultValue={q} placeholder={t("searchName")} aria-label={t("searchName")}/>
                        <Button type="submit" variant="outline">{t("search")}</Button>
                    </form>
                    {found.length > 0 && (
                        <AttachForm requestId={id} people={found.filter(person => !have.has(person.id)).map(person => ({id: person.id, name: `${person.firstName} ${person.lastName}`}))}/>
                    )}
                </section>
                <div><Button variant="outline" nativeButton={false} render={<Link href="/treasurer/payments"/>}>{t("back")}</Button></div>
            </div>
        );
    });
}
