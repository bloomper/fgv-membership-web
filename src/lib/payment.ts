import "server-only";

import { graphql } from "@/lib/graphql";

export type PaymentStatus = "OPEN" | "REPORTED" | "MATCHED" | "CANCELLED";
export type PaymentHow = "SWISH" | "BANK_TRANSFER" | "CASH";

export type PaymentItem = { id: string; year: number; lifetime: boolean; status: string };
export type PaymentRequest = {
  id: string;
  reference: string;
  amount: number;
  paid: number;
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
export type BankFormat = { id: string; name: string; charset: string; delimiter: string; headerLines: number; dateColumn: number; amountColumn: number; textColumn: number; payerColumn: number | null; dateFormat: string; decimalComma: boolean };
export type BankTransaction = { id: string; bookedOn: string; amount: number; text: string | null; payer: string | null; status: string; fileName: string | null };
export type Suggestion = { requestId: string; reference: string; spexareName: string | null; amount: number; status: PaymentStatus; why: "REFERENCE" | "NAME" };
export type PaymentLine = { id: string; reference: string; spexareName: string | null; paidOn: string; amount: number; how: PaymentHow; note: string | null; transaction: boolean };
export type ImportResult = { read: number; added: number; duplicates: number; outgoing: number; matched: number; errors: string[] };
export type MembershipItem = { id: string; type: string; year: number; lifetime: boolean; status: string };
export type FeeLevel = { id: string; year: number | null; lifetime: boolean; nameSv: string; nameEn: string; amount: number; retired: boolean };

const REQUEST_FIELDS = `id reference amount paid status createdAt reportedAt paidBy spexareName memberships { id year lifetime status } payee { swishNumber bankAccount name }`;
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

const FORMAT_FIELDS = `id name charset delimiter headerLines dateColumn amountColumn textColumn payerColumn dateFormat decimalComma`;

export async function bankFormats(token: string) {
  return (await graphql<{ bankFormats: BankFormat[] }>(token, `{ bankFormats { ${FORMAT_FIELDS} } }`)).bankFormats;
}

export async function unmatchedTransactions(token: string) {
  return (await graphql<{ unmatchedTransactions: BankTransaction[] }>(token, `{ unmatchedTransactions { id bookedOn amount text payer status fileName } }`)).unmatchedTransactions;
}

export async function suggestionsFor(token: string, id: string) {
  return (await graphql<{ transactionSuggestions: Suggestion[] }>(token, `query ($id: ID!) { transactionSuggestions(id: $id) { requestId reference spexareName amount status why } }`, { id })).transactionSuggestions;
}

export async function paymentsThisYear(token: string) {
  return (await graphql<{ paymentsThisYear: PaymentLine[] }>(token, `{ paymentsThisYear { id reference spexareName paidOn amount how note transaction } }`)).paymentsThisYear;
}

export const bankMutations = {
  importStatement: `mutation ($formatId: ID!, $fileName: String!, $content: String!) { importStatement(formatId: $formatId, fileName: $fileName, content: $content) { read added duplicates outgoing matched errors } }`,
  matchTransaction: `mutation ($id: ID!, $requestIds: [ID!]!) { matchTransaction(id: $id, requestIds: $requestIds) { id } }`,
  dismissTransaction: `mutation ($id: ID!) { dismissTransaction(id: $id) { id } }`,
  undoPayment: `mutation ($id: ID!) { undoPayment(id: $id) }`,
  bankFormatSave: `mutation ($input: BankFormatInput!) { bankFormatSave(input: $input) { id } }`,
  bankFormatDelete: `mutation ($id: ID!) { bankFormatDelete(id: $id) }`,
} as const;
