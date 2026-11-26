import "server-only";

import {graphql} from "@/gql";
import type {FeeLevelInput} from "@/gql/graphql";
import {runMutation, runQuery} from "@/lib/graphql.server";

// The fee levels members pick from (payment.graphqls), which an administrator keeps.

const AllFeeLevelsQuery = graphql(`
    query AllFeeLevels { allFeeLevels { ...FeeLevelFields } }
`);

const FeeLevelSaveMutation = graphql(`
    mutation FeeLevelSave($input: FeeLevelInput!) { feeLevelSave(input: $input) { id } }
`);

const FeeLevelRetireMutation = graphql(`
    mutation FeeLevelRetire($id: ID!, $retired: Boolean!) { feeLevelRetire(id: $id, retired: $retired) { id } }
`);

export async function getAllFeeLevels() {
    return (await runQuery(AllFeeLevelsQuery, {}))?.allFeeLevels ?? [];
}

export async function saveFeeLevel(input: FeeLevelInput) {
    await runMutation(FeeLevelSaveMutation, {input});
}

export async function retireFeeLevel(id: string, retired: boolean) {
    await runMutation(FeeLevelRetireMutation, {id, retired});
}
