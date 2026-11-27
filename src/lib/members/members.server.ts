import "server-only";

import {graphql} from "@/gql";
import type {PaymentHow} from "@/gql/graphql";
import {runMutation, runQuery} from "@/lib/graphql.server";

// The board's view of the members (board.graphqls) and of family requests (payment.graphqls).

const MembersQuery = graphql(`
    query Members($year: Int!, $status: String, $how: String, $was: Boolean) {
        members(year: $year, status: $status, how: $how, wasMemberLastYear: $was) {
            membershipId spexareId name year lifetime status how note optedOut family support
        }
    }
`);

const MemberTrendQuery = graphql(`
    query MemberTrend { memberTrend { year members lifetime joined } }
`);

const MemberDetailQuery = graphql(`
    query MemberDetail($id: ID!) {
        memberDetail(spexareId: $id) {
            spexare { id firstName lastName email }
            optedOut
            memberships { id year lifetime status how note }
            requests { id reference amount paid status memberships { year } }
            emails { kind sentAt }
        }
    }
`);

const SpexareSearchQuery = graphql(`
    query SpexareSearch($q: String!) { spexareSearch(q: $q) { id firstName lastName email } }
`);

const RenewalPreviewQuery = graphql(`
    query RenewalPreview($year: Int!, $fee: ID!) {
        renewalPreview(year: $year, feeLevelId: $fee) { year count sample subject text }
    }
`);

const FamilyRequestQuery = graphql(`
    query FamilyRequest($id: ID!) {
        paymentRequest(id: $id) { id reference familyNote familyMembers { id firstName lastName } }
    }
`);

const SendRenewalsMutation = graphql(`
    mutation SendRenewals($year: Int!, $fee: ID!) { sendRenewals(year: $year, feeLevelId: $fee) { sent skipped } }
`);

const GrantWaiverMutation = graphql(`
    mutation GrantWaiver($spexareId: ID!, $year: Int!, $lifetime: Boolean!, $note: String!) {
        grantWaiver(spexareId: $spexareId, year: $year, lifetime: $lifetime, note: $note) { id }
    }
`);

const RecordPaymentWithoutRequestMutation = graphql(`
    mutation RecordPaymentWithoutRequest($spexareId: ID!, $fees: [ID!]!, $paidOn: String!, $amount: Int!, $how: PaymentHow!, $note: String) {
        recordPaymentWithoutRequest(spexareId: $spexareId, feeLevelIds: $fees, paidOn: $paidOn, amount: $amount, how: $how, note: $note) { id }
    }
`);

const SendPaymentLinkMutation = graphql(`
    mutation SendPaymentLink($spexareId: ID!, $fees: [ID!]!) { sendPaymentLink(spexareId: $spexareId, feeLevelIds: $fees) }
`);

const AddFamilyMembersMutation = graphql(`
    mutation AddFamilyMembers($requestId: ID!, $spexareIds: [ID!]!) { addFamilyMembers(requestId: $requestId, spexareIds: $spexareIds) { id } }
`);

export async function listMembers(year: number, status: string | null, how: string | null, wasMemberLastYear: boolean | null) {
    return (await runQuery(MembersQuery, {year, status, how, was: wasMemberLastYear}))?.members ?? [];
}

export async function getMemberTrend() {
    return (await runQuery(MemberTrendQuery, {}))?.memberTrend ?? [];
}

export async function getMemberDetail(spexareId: string) {
    return (await runQuery(MemberDetailQuery, {id: spexareId}))?.memberDetail;
}

export async function searchSpexare(q: string) {
    return (await runQuery(SpexareSearchQuery, {q}))?.spexareSearch ?? [];
}

export async function getRenewalPreview(year: number, feeLevelId: string) {
    return (await runQuery(RenewalPreviewQuery, {year, fee: feeLevelId}))?.renewalPreview;
}

export async function getFamilyRequest(id: string) {
    return (await runQuery(FamilyRequestQuery, {id}))?.paymentRequest;
}

export async function sendRenewals(year: number, feeLevelId: string) {
    return (await runMutation(SendRenewalsMutation, {year, fee: feeLevelId}))?.sendRenewals;
}

export async function grantWaiver(spexareId: string, year: number, lifetime: boolean, note: string) {
    await runMutation(GrantWaiverMutation, {spexareId, year, lifetime, note});
}

export async function recordPaymentWithoutRequest(spexareId: string, fees: string[], paidOn: string, amount: number, how: PaymentHow, note: string | null) {
    await runMutation(RecordPaymentWithoutRequestMutation, {spexareId, fees, paidOn, amount, how, note});
}

export async function sendPaymentLink(spexareId: string, fees: string[]) {
    return (await runMutation(SendPaymentLinkMutation, {spexareId, fees}))?.sendPaymentLink ?? false;
}

export async function addFamilyMembers(requestId: string, spexareIds: string[]) {
    await runMutation(AddFamilyMembersMutation, {requestId, spexareIds});
}
