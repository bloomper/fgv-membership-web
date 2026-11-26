import "server-only";

import {graphql} from "@/gql";
import type {PaymentHow} from "@/gql/graphql";
import {runMutation, runQuery} from "@/lib/graphql.server";

// What the treasurer handles: the requests that wait for money and the payments recorded (payment.graphqls, bank.graphqls).

const WaitingRequestsQuery = graphql(`
    query WaitingRequests {
        waitingPaymentRequests { ...PaymentRequestFields }
    }
`);

const PaymentsThisYearQuery = graphql(`
    query PaymentsThisYear {
        paymentsThisYear { id reference spexareName paidOn amount how note transaction }
    }
`);

const RecordPaymentMutation = graphql(`
    mutation RecordPayment($requestId: ID!, $paidOn: String!, $amount: Int!, $how: PaymentHow!, $note: String) {
        recordPayment(requestId: $requestId, paidOn: $paidOn, amount: $amount, how: $how, note: $note) { id }
    }
`);

const CancelPaymentRequestMutation = graphql(`
    mutation CancelPaymentRequest($id: ID!) { cancelPaymentRequest(id: $id) { id } }
`);

const UndoPaymentMutation = graphql(`
    mutation UndoPayment($id: ID!) { undoPayment(id: $id) }
`);

export async function getWaitingRequests() {
    return (await runQuery(WaitingRequestsQuery, {}))?.waitingPaymentRequests ?? [];
}

export async function getPaymentsThisYear() {
    return (await runQuery(PaymentsThisYearQuery, {}))?.paymentsThisYear ?? [];
}

export async function recordPayment(requestId: string, paidOn: string, amount: number, how: PaymentHow, note: string | null) {
    await runMutation(RecordPaymentMutation, {requestId, paidOn, amount, how, note});
}

export async function cancelPaymentRequest(id: string) {
    await runMutation(CancelPaymentRequestMutation, {id});
}

export async function undoPayment(id: string) {
    await runMutation(UndoPaymentMutation, {id});
}
