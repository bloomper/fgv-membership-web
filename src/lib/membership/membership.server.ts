import "server-only";

import { graphql } from "@/gql";
import { runMutation, runQuery } from "@/lib/graphql.server";

// A person's own membership: what they have, what they owe, and applying (membership.graphqls, application.graphqls).

const MyMembershipQuery = graphql(`
    query MyMembership {
        myMembership {
            linked
            memberships { id type year lifetime status }
            requests { ...PaymentRequestFields }
        }
    }
`);

const MyApplicationQuery = graphql(`
    query MyApplication {
        myApplication { id status decisionMessage }
    }
`);

const FeeLevelsQuery = graphql(`
    query FeeLevels {
        feeLevels { ...FeeLevelFields }
    }
`);

/** With the Swish link and the QR code, which the server only makes when asked. */
const PaymentRequestQuery = graphql(`
    query PaymentRequest($id: ID!) {
        paymentRequest(id: $id) { ...PaymentRequestFields swishLink qr }
    }
`);

const ApplyForMembershipMutation = graphql(`
    mutation ApplyForMembership($name: String!, $text: String!) { applyForMembership(name: $name, text: $text) { id } }
`);

const RequestPaymentMutation = graphql(`
    mutation RequestPayment($feeLevelIds: [ID!]!, $familyNote: String) { requestPayment(feeLevelIds: $feeLevelIds, familyNote: $familyNote) { id } }
`);

const ReportPaidMutation = graphql(`
    mutation ReportPaid($id: ID!, $paidBy: String) { reportPaid(id: $id, paidBy: $paidBy) { id } }
`);

export async function getMyMembership() {
  return (await runQuery(MyMembershipQuery, {}))?.myMembership;
}

export async function getMyApplication() {
  return (await runQuery(MyApplicationQuery, {}))?.myApplication;
}

export async function getFeeLevels() {
  return (await runQuery(FeeLevelsQuery, {}))?.feeLevels ?? [];
}

export async function getPaymentRequest(id: string) {
  return (await runQuery(PaymentRequestQuery, { id }))?.paymentRequest;
}

export async function applyForMembership(name: string, text: string) {
  await runMutation(ApplyForMembershipMutation, { name, text });
}

export async function requestPayment(feeLevelIds: string[], familyNote: string | null) {
  return (await runMutation(RequestPaymentMutation, { feeLevelIds, familyNote }))?.requestPayment.id;
}

export async function reportPaid(id: string, paidBy: string | null) {
  await runMutation(ReportPaidMutation, { id, paidBy });
}
