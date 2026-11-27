import {getTranslations} from "next-intl/server";
import {SettingsForm} from "@/components/admin/settings-form.client";
import {getSettings} from "@/lib/settings/settings.server";
import {Policies} from "@/utils/policy.server";
import {withPolicyPage} from "@/utils/route.server";
import {Page, PageHeader} from "@bloomper/fgv-web-ui/shell/page-header";

/** Where members pay and who is told about payments. */
export default async function SettingsPage() {
    return withPolicyPage(Policies.admin.requireAdmin, async () => {
        const t = await getTranslations("Settings");
        const settings = await getSettings();

        return (
            <Page>
                <PageHeader title={t("title")} description={t("intro")}/>
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
            </Page>
        );
    });
}
