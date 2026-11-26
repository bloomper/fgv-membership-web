import {getTranslations} from "next-intl/server";
import {SettingsForm} from "@/components/admin/settings-form.client";
import {getSettings} from "@/lib/settings/settings.server";
import {Policies} from "@/utils/policy.server";
import {withPolicyPage} from "@/utils/route.server";

/** Where members pay and who is told about payments. */
export default async function SettingsPage() {
    return withPolicyPage(Policies.admin.requireAdmin, async () => {
        const t = await getTranslations("Settings");
        const settings = await getSettings();

        return (
            <div className="flex flex-1 flex-col gap-4 p-4 md:p-8">
                <h1 className="text-2xl font-bold tracking-tight">{t("title")}</h1>
                <p className="max-w-prose text-sm text-muted-foreground">{t("intro")}</p>
                {settings && (
                    <SettingsForm settings={{
                        swishNumber: settings.swishNumber ?? "",
                        bankgiro: settings.bankgiro ?? "",
                        bankAccount: settings.bankAccount ?? "",
                        payeeName: settings.payeeName ?? "",
                        reminderDays: settings.reminderDays,
                        recipients: settings.recipients.join("\n"),
                    }}/>
                )}
            </div>
        );
    });
}
