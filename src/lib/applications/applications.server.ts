import "server-only";

import {graphql} from "@/gql";
import {runMutation, runQuery} from "@/lib/graphql.server";

// Applications for a membership, which the board decides (application.graphqls).

const PendingApplicationsQuery = graphql(`
    query PendingApplications {
        membershipApplications { id applicantName applicantEmail text status createdAt }
    }
`);

const AcceptApplicationMutation = graphql(`
    mutation AcceptApplication($id: ID!, $spexareId: ID) { acceptApplication(id: $id, spexareId: $spexareId) { id } }
`);

const RejectApplicationMutation = graphql(`
    mutation RejectApplication($id: ID!, $message: String) { rejectApplication(id: $id, message: $message) { id } }
`);

export async function getPendingApplications() {
    return (await runQuery(PendingApplicationsQuery, {}))?.membershipApplications ?? [];
}

export async function acceptApplication(id: string, spexareId: string | null) {
    await runMutation(AcceptApplicationMutation, {id, spexareId});
}

export async function rejectApplication(id: string, message: string | null) {
    await runMutation(RejectApplicationMutation, {id, message});
}
