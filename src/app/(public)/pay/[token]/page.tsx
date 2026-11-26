import Link from "next/link";
import {notFound} from "next/navigation";
import {connection} from "next/server";
import {getTranslations} from "next-intl/server";
import {PaymentDetails} from "@/components/payment/payment-details";
import {OptOutButton} from "@/components/payment/opt-out-button.client";
import {ReportPaidForm} from "@/components/payment/report-paid-form.client";
import {apiFetchPublic} from "@/lib/api.server";
import {optOutByLinkAction, reportPaidByLinkAction} from "@/app/(public)/pay/[token]/actions.server";

type PersonalPage = {
    reference: string;
    amount: number;
    paid: number;
    status: "OPEN" | "REPORTED" | "MATCHED" | "CANCELLED";
    years: number[];
    swishNumber: string | null;
    bankgiro: string | null;
    bankAccount: string | null;
    swishLink: string | null;
    qr: string | null;
    optedOut: boolean;
};

/** A personal link: the payment request and nothing else, for people who pay without logging in. */
export default async function PersonalLinkPage({params}: { params: Promise<{ token: string }> }) {
    await connection();

    const {token} = await params;
    const t = await getTranslations("Pay");
    const tl = await getTranslations("Personal");
    const response = await apiFetchPublic(`/api/personal/${encodeURIComponent(token)}`);

    if (response.status === 404) {
        notFound();
    }
    if (!response.ok) {
        throw new Error("The payment page could not be loaded");
    }

    const page = await response.json() as PersonalPage;
    const open = page.status === "OPEN" || page.status === "REPORTED";

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold tracking-tight">{t("payTitle")}</h1>
            <p>{page.years.join(", ")}</p>
            {page.status === "MATCHED" && <p role="status" className="font-semibold">{t("confirmed")}</p>}
            {page.status === "CANCELLED" && <p role="status">{t("cancelled")}</p>}
            {open && (
                <>
                    <PaymentDetails amount={page.amount - page.paid} reference={page.reference} swishNumber={page.swishNumber}
                                    bankgiro={page.bankgiro} bankAccount={page.bankAccount} swishLink={page.swishLink} qr={page.qr}/>
                    {page.status === "REPORTED"
                        ? <p role="status" className="font-semibold">{t("waitingForConfirmation")}</p>
                        : <ReportPaidForm report={reportPaidByLinkAction.bind(null, token)}/>}
                </>
            )}
            <section className="space-y-3 border-t pt-4 text-sm">
                {page.optedOut ? <p>{tl("optedOut")}</p> : <OptOutButton optOut={optOutByLinkAction.bind(null, token)}/>}
                <p>
                    {tl("account")}{" "}
                    <a className="underline underline-offset-4" href="/api/auth/login">{tl("login")}</a>
                    {" · "}
                    <Link className="underline underline-offset-4" href="/register">{tl("register")}</Link>
                </p>
            </section>
        </div>
    );
}
