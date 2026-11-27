import Link from "next/link";
import {getTranslations} from "next-intl/server";
import {Button} from "@bloomper/fgv-web-ui/ui/button";
import {PaymentDetails} from "@/components/payment/payment-details";
import {ReportPaidForm} from "@/components/payment/report-paid-form.client";
import {getPaymentRequest} from "@/lib/membership/membership.server";
import {Policies} from "@/utils/policy.server";
import {withPolicyPage} from "@/utils/route.server";
import {reportPaidAction} from "@/app/(app)/membership/actions.server";
import {Page, PageHeader} from "@bloomper/fgv-web-ui/shell/page-header";

/** How to pay a request, and a way to say that it is paid. */
export default async function PaymentPage({params}: { params: Promise<{ id: string }> }) {
    const {id} = await params;

    return withPolicyPage(Policies.app.requireAccess, async () => {
        const t = await getTranslations("Pay");
        const request = await getPaymentRequest(id);

        if (!request) {
            return null;
        }

        const open = request.status === "OPEN" || request.status === "REPORTED";

        return (
            <Page variant="content">
                <PageHeader title={t("payTitle")}/>
                <p>{request.memberships.map(item => (item.lifetime ? t("lifeFrom", {year: item.year}) : String(item.year))).join(", ")}</p>
                {request.family && (
                    <p className="text-sm text-muted-foreground">
                        {request.familyIncomplete ? t("familyPending") : t("familyCount", {count: new Set(request.memberships.map(item => item.spexareId)).size})}
                    </p>
                )}
                {request.status === "MATCHED" && <p role="status" className="font-semibold">{t("confirmed")}</p>}
                {request.status === "CANCELLED" && <p role="status">{t("cancelled")}</p>}
                {open && (
                    <>
                        <PaymentDetails amount={request.amount - request.paid} reference={request.reference}
                                        swishNumber={request.payee.swishNumber} bankgiro={request.payee.bankgiro}
                                        bankAccount={request.payee.bankAccount} swishLink={request.swishLink} qr={request.qr}/>
                        {request.status === "REPORTED"
                            ? <p role="status" className="font-semibold">{t("waitingForConfirmation")}</p>
                            : <ReportPaidForm report={reportPaidAction.bind(null, request.id)}/>}
                    </>
                )}
                <div><Button variant="outline" nativeButton={false} render={<Link href="/membership"/>}>{t("back")}</Button></div>
            </Page>
        );
    });
}
