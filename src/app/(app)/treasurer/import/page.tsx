import Link from "next/link";
import {getTranslations} from "next-intl/server";
import {ImportForm} from "@/components/treasurer/import-form.client";
import {getBankFormats} from "@/lib/bank/bank.server";
import {Policies} from "@/utils/policy.server";
import {withPolicyPage} from "@/utils/route.server";

/** Upload the account's transactions as a CSV file from the bank. */
export default async function ImportPage() {
    return withPolicyPage(Policies.treasurer.requireTreasurer, async () => {
        const t = await getTranslations("Bank");
        const formats = await getBankFormats();

        return (
            <div className="flex flex-1 flex-col gap-4 p-4 md:p-8">
                <h1 className="text-2xl font-bold tracking-tight">{t("importTitle")}</h1>
                <p className="max-w-prose text-sm text-muted-foreground">{t("importIntro")}</p>
                {formats.length === 0
                    ? <p>{t("noFormats")}</p>
                    : <ImportForm formats={formats.map(format => ({id: format.id, name: format.name}))}/>}
                <p><Link className="underline underline-offset-4" href="/treasurer/transactions">{t("toTransactions")}</Link></p>
            </div>
        );
    });
}
