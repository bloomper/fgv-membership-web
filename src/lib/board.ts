import "server-only";

import { graphql } from "@/lib/graphql";
import type { PaymentRequest } from "@/lib/payment";

export type Member = {
  membershipId: string; spexareId: string; name: string | null; type: string; year: number; lifetime: boolean;
  status: string; how: string | null; note: string | null; optedOut: boolean; wasMemberLastYear: boolean; family: boolean; support: boolean;
};
export type MemberCount = { year: number; members: number; lifetime: number; joined: number };
export type MemberItem = { id: string; type: string; year: number; lifetime: boolean; status: string; how: string | null; note: string | null };
export type MemberDetail = {
  spexare: { id: string; firstName: string; lastName: string; email: string | null };
  optedOut: boolean;
  memberships: MemberItem[];
  requests: PaymentRequest[];
  emails: { kind: string; sentAt: string }[];
};
export type Person = { id: string; firstName: string; lastName: string; email: string | null };
export type RenewalPreview = { year: number; count: number; sample: string[]; subject: string; text: string };

export async function listMembers(token: string, year: number, status: string | null, how: string | null, wasMemberLastYear: boolean | null) {
  return (await graphql<{ members: Member[] }>(token,
    `query ($year: Int!, $status: String, $how: String, $was: Boolean) { members(year: $year, status: $status, how: $how, wasMemberLastYear: $was) { membershipId spexareId name type year lifetime status how note optedOut wasMemberLastYear family support } }`,
    { year, status, how, was: wasMemberLastYear })).members;
}

export async function memberTrend(token: string) {
  return (await graphql<{ memberTrend: MemberCount[] }>(token, `{ memberTrend { year members lifetime joined } }`)).memberTrend;
}

export async function memberDetail(token: string, spexareId: string) {
  return (await graphql<{ memberDetail: MemberDetail }>(token,
    `query ($id: ID!) { memberDetail(spexareId: $id) { spexare { id firstName lastName email } optedOut
       memberships { id type year lifetime status how note }
       requests { id reference amount paid status createdAt reportedAt paidBy memberships { id year lifetime status } payee { swishNumber bankAccount name } }
       emails { kind sentAt } } }`, { id: spexareId })).memberDetail;
}

export async function searchSpexare(token: string, q: string) {
  return (await graphql<{ spexareSearch: Person[] }>(token, `query ($q: String!) { spexareSearch(q: $q) { id firstName lastName email } }`, { q })).spexareSearch;
}

export async function renewalPreview(token: string, year: number, feeLevelId: string) {
  return (await graphql<{ renewalPreview: RenewalPreview }>(token,
    `query ($year: Int!, $fee: ID!) { renewalPreview(year: $year, feeLevelId: $fee) { year count sample subject text } }`, { year, fee: feeLevelId })).renewalPreview;
}

export const boardMutations = {
  sendRenewals: `mutation ($year: Int!, $fee: ID!) { sendRenewals(year: $year, feeLevelId: $fee) { sent skipped } }`,
  grantWaiver: `mutation ($spexareId: ID!, $year: Int!, $lifetime: Boolean!, $note: String!) { grantWaiver(spexareId: $spexareId, year: $year, lifetime: $lifetime, note: $note) { id } }`,
  recordPaymentWithoutRequest: `mutation ($spexareId: ID!, $fees: [ID!]!, $paidOn: String!, $amount: Int!, $how: PaymentHow!, $note: String) { recordPaymentWithoutRequest(spexareId: $spexareId, feeLevelIds: $fees, paidOn: $paidOn, amount: $amount, how: $how, note: $note) { id } }`,
  sendPaymentLink: `mutation ($spexareId: ID!, $fees: [ID!]!) { sendPaymentLink(spexareId: $spexareId, feeLevelIds: $fees) }`,
} as const;

/** The API's address for personal links, derived from the GraphQL one unless it is set. */
export function personalLinkEndpoint(): string {
  return process.env.API_PERSONAL_ENDPOINT ?? (process.env.API_GRAPHQL_ENDPOINT ?? "http://localhost:8087/api/graphql").replace(/\/graphql$/, "/personal");
}
