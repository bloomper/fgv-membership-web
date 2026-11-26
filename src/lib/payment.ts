import "server-only";

import { graphql } from "@/lib/graphql";

export type PaymentStatus = "OPEN" | "REPORTED" | "MATCHED" | "CANCELLED";
export type PaymentHow = "SWISH" | "BANK_TRANSFER" | "CASH";

export type PaymentItem = { id: string; year: number; lifetime: boolean; status: string };
export type PaymentRequest = {
  id: string;
  reference: string;
  amount: number;
  status: PaymentStatus;
  createdAt: string;
  reportedAt: string | null;
  paidBy: string | null;
  spexareName: string | null;
  memberships: PaymentItem[];
  payee: { swishNumber: string | null; bankAccount: string | null; name: string };
  swishLink: string | null;
  qr: string | null;
};
export type MembershipItem = { id: string; type: string; year: number; lifetime: boolean; status: string };
export type FeeLevel = { id: string; year: number | null; lifetime: boolean; nameSv: string; nameEn: string; amount: number; retired: boolean };

const REQUEST_FIELDS = `id reference amount status createdAt reportedAt paidBy spexareName memberships { id year lifetime status } payee { swishNumber bankAccount name }`;
const FEE_FIELDS = `id year lifetime nameSv nameEn amount retired`;

export async function myMembership(token: string) {
  const data = await graphql<{ myMembership: { linked: boolean; memberships: MembershipItem[]; requests: PaymentRequest[] } }>(
    token,
    `{ myMembership { linked memberships { id type year lifetime status } requests { ${REQUEST_FIELDS} } } }`,
  );

  return data.myMembership;
}

export async function feeLevels(token: string) {
  return (await graphql<{ feeLevels: FeeLevel[] }>(token, `{ feeLevels { ${FEE_FIELDS} } }`)).feeLevels;
}

/** With the Swish link and the QR code, which the server only makes when asked. */
export async function paymentRequest(token: string, id: string) {
  return (await graphql<{ paymentRequest: PaymentRequest }>(token, `query ($id: ID!) { paymentRequest(id: $id) { ${REQUEST_FIELDS} swishLink qr } }`, { id })).paymentRequest;
}

export async function waitingRequests(token: string) {
  return (await graphql<{ waitingPaymentRequests: PaymentRequest[] }>(token, `{ waitingPaymentRequests { ${REQUEST_FIELDS} } }`)).waitingPaymentRequests;
}

export async function allFeeLevels(token: string) {
  return (await graphql<{ allFeeLevels: FeeLevel[] }>(token, `{ allFeeLevels { ${FEE_FIELDS} } }`)).allFeeLevels;
}

export const paymentMutations = {
  requestPayment: `mutation ($feeLevelIds: [ID!]!) { requestPayment(feeLevelIds: $feeLevelIds) { id } }`,
  reportPaid: `mutation ($id: ID!, $paidBy: String) { reportPaid(id: $id, paidBy: $paidBy) { id } }`,
  recordPayment: `mutation ($requestId: ID!, $paidOn: String!, $amount: Int!, $how: PaymentHow!, $note: String) { recordPayment(requestId: $requestId, paidOn: $paidOn, amount: $amount, how: $how, note: $note) { id } }`,
  cancelPaymentRequest: `mutation ($id: ID!) { cancelPaymentRequest(id: $id) { id } }`,
  feeLevelSave: `mutation ($input: FeeLevelInput!) { feeLevelSave(input: $input) { id } }`,
  feeLevelRetire: `mutation ($id: ID!, $retired: Boolean!) { feeLevelRetire(id: $id, retired: $retired) { id } }`,
} as const;

export type DefaultAccess = { clientId: string; name: string; ladder: string[]; role: string | null };

export async function defaultAccess(token: string) {
  return (await graphql<{ defaultAccess: DefaultAccess[] }>(token, `{ defaultAccess { clientId name ladder role } }`)).defaultAccess;
}

export const defaultAccessMutations = {
  setDefaultAccess: `mutation ($clientId: String!, $role: String) { setDefaultAccess(clientId: $clientId, role: $role) { clientId } }`,
} as const;
