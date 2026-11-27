import {getTranslations} from "next-intl/server";
import {Button} from "@bloomper/fgv-web-ui/ui/button";
import {Input} from "@bloomper/fgv-web-ui/ui/input";
import {Card, CardContent, CardHeader, CardTitle} from "@bloomper/fgv-web-ui/ui/card";
import {DataEmpty} from "@bloomper/fgv-web-ui/shell/data-empty";
import {DecisionForms} from "@/components/applications/decision-forms.client";
import {getPendingApplications} from "@/lib/applications/applications.server";
import {searchSpexare} from "@/lib/members/members.server";
import {formatDate} from "@/utils/format";
import {Policies} from "@/utils/policy.server";
import {withPolicyPage} from "@/utils/route.server";
import {Page, PageHeader} from "@bloomper/fgv-web-ui/shell/page-header";

/** Applications for a membership: the board links each to a spexare in the register, or creates one. */
export default async function ApplicationsPage({searchParams}: { searchParams: Promise<{ q?: string; app?: string }> }) {
    return withPolicyPage(Policies.board.requireBoard, async () => {
        const t = await getTranslations("Applications");
        const {q, app} = await searchParams;
        const applications = await getPendingApplications();
        const found = q ? await searchSpexare(q) : [];

        return (
            <Page>
                <PageHeader title={t("title")} description={t("intro")}/>
                {applications.length === 0 ? <DataEmpty title={t("none")} description=""/> : (
                    <ul className="space-y-4">
                        {applications.map(application => (
                            <li key={application.id}>
                                <Card>
                                    <CardHeader>
                                        <CardTitle>
                                            {application.applicantName}{" "}
                                            <span className="text-sm font-normal text-muted-foreground">({application.applicantEmail ?? "?"}) – {formatDate(application.createdAt)}</span>
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-3">
                                        <p className="text-sm whitespace-pre-wrap">{application.text}</p>
                                        <form className="flex max-w-md gap-2" action="/board/applications">
                                            <input type="hidden" name="app" value={application.id}/>
                                            <Input type="search" name="q" defaultValue={app === application.id ? q : ""} placeholder={t("searchName")} aria-label={t("searchName")}/>
                                            <Button type="submit" variant="outline">{t("search")}</Button>
                                        </form>
                                        <DecisionForms id={application.id}
                                                       people={app === application.id ? found.map(person => ({id: person.id, name: `${person.firstName} ${person.lastName}${person.email ? ` (${person.email})` : ""}`})) : []}/>
                                    </CardContent>
                                </Card>
                            </li>
                        ))}
                    </ul>
                )}
            </Page>
        );
    });
}
