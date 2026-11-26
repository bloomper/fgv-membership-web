import {getLocale, getTranslations} from "next-intl/server";
import {PayForm} from "@/components/membership/pay-form.client";
import {getFeeLevels} from "@/lib/membership/membership.server";
import {Policies} from "@/utils/policy.server";
import {withPolicyPage} from "@/utils/route.server";

/** Pick the fees to pay: one for each year, or the life fee. */
export default async function PayPage() {
    return withPolicyPage(Policies.app.requireAccess, async () => {
        const t = await getTranslations("Pay");
        const locale = await getLocale();
        const fees = await getFeeLevels();
        const options = fees.map(fee => ({
            id: fee.id,
            group: fee.lifetime ? "life" : String(fee.year),
            label: `${locale === "sv" ? fee.nameSv : fee.nameEn}${fee.lifetime ? ` (${t("forLife")})` : fee.year ? ` ${fee.year}` : ""}${fee.kind === "FAMILY" ? ` (${t("family")})` : fee.kind === "SUPPORT" ? ` (${t("support")})` : ""}`,
            amount: fee.amount,
            family: fee.kind === "FAMILY",
        }));

        return (
            <div className="flex flex-1 flex-col gap-4 p-4 md:p-8">
                <h1 className="text-2xl font-bold tracking-tight">{t("title")}</h1>
                {options.length === 0 ? <p className="text-sm text-muted-foreground">{t("noFees")}</p> : (
                    <>
                        <p className="max-w-prose text-sm text-muted-foreground">{t("intro")}</p>
                        <PayForm options={options}/>
                    </>
                )}
            </div>
        );
    });
}
