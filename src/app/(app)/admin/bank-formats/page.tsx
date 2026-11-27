import {getTranslations} from "next-intl/server";
import {BankFormatForm} from "@/components/admin/bank-format-form.client";
import {getBankFormats} from "@/lib/bank/bank.server";
import {Policies} from "@/utils/policy.server";
import {withPolicyPage} from "@/utils/route.server";

/** The layout of each bank's CSV file, described once. */
export default async function BankFormatsPage() {
    return withPolicyPage(Policies.admin.requireAdmin, async () => {
        const t = await getTranslations("Formats");
        const formats = await getBankFormats();

        return (
            <div className="flex flex-1 flex-col gap-4 p-4 md:p-8">
                <h1 className="text-2xl font-bold tracking-tight">{t("title")}</h1>
                <p className="max-w-prose text-sm text-muted-foreground">{t("intro")}</p>
                <ul className="space-y-6">
                    {formats.map(format => (
                        <li key={format.id}>
                            <BankFormatForm format={{...format, payerColumn: format.payerColumn ?? null}}/>
                        </li>
                    ))}
                </ul>
                <section className="space-y-2">
                    <h2 className="text-lg font-semibold">{t("add")}</h2>
                    <BankFormatForm format={null}/>
                </section>
            </div>
        );
    });
}
