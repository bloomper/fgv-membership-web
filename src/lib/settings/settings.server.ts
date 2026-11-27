import "server-only";

import { graphql } from "@/gql";
import type { SettingsInput } from "@/gql/graphql";
import { runMutation, runQuery } from "@/lib/graphql.server";

// Where members pay, who is told, and when payers are reminded (admin.graphqls).

const SettingsQuery = graphql(`
    query Settings { settings { swishNumber bankgiro bankAccount payeeName reminderDays recipients } }
`);

const SaveSettingsMutation = graphql(`
    mutation SaveSettings($input: SettingsInput!) { saveSettings(input: $input) { reminderDays } }
`);

export async function getSettings() {
  return (await runQuery(SettingsQuery, {}))?.settings;
}

export async function saveSettings(input: SettingsInput) {
  await runMutation(SaveSettingsMutation, { input });
}
