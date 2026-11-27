import "server-only";

import {graphql} from "@/gql";
import type {AccessProfile} from "@/gql/graphql";
import {runMutation, runQuery} from "@/lib/graphql.server";

// The access a new account gets when it is made from a payment elsewhere (defaultAccess.graphqls).

export const ACCESS_PROFILES: AccessProfile[] = ["MEMBER", "SUPPORT"];

const DefaultAccessQuery = graphql(`
    query DefaultAccess($profile: AccessProfile) { defaultAccess(profile: $profile) { clientId name ladder role } }
`);

const SetDefaultAccessMutation = graphql(`
    mutation SetDefaultAccess($profile: AccessProfile, $clientId: String!, $role: String) {
        setDefaultAccess(profile: $profile, clientId: $clientId, role: $role) { clientId }
    }
`);

export async function getDefaultAccess(profile: AccessProfile) {
    return (await runQuery(DefaultAccessQuery, {profile}))?.defaultAccess ?? [];
}

export async function setDefaultAccess(profile: AccessProfile, clientId: string, role: string | null) {
    await runMutation(SetDefaultAccessMutation, {profile, clientId, role});
}
