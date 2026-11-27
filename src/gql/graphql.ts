/* eslint-disable */
import type { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
/** Internal type. DO NOT USE DIRECTLY. */
type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
/** Internal type. DO NOT USE DIRECTLY. */
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
export type AccessProfile =
  /** Standard, family and life memberships */
  | 'MEMBER'
  /** Support memberships (stödmedlemskap) */
  | 'SUPPORT';

export type ApplicationStatus =
  | 'ACCEPTED'
  | 'PENDING'
  | 'REJECTED';

export type BankFormatInput = {
  amountColumn: number;
  charset?: string;
  /** Columns are counted from 1 */
  dateColumn: number;
  /** A Java date pattern, e.g. yyyy-MM-dd */
  dateFormat?: string;
  /** Amounts like 1 200,00 rather than 1,200.00 */
  decimalComma?: boolean;
  delimiter?: string;
  /** Rows before the first transaction */
  headerLines?: number;
  id?: string | number | null | undefined;
  name: string;
  payerColumn?: number | null | undefined;
  textColumn: number;
};

export type FeeKind =
  /** A family, for a year: one pays and every family member is a member */
  | 'FAMILY'
  /** One person, for life from the year it is paid */
  | 'LIFETIME'
  /** One person, for a year */
  | 'STANDARD'
  /** A support membership (stödmedlemskap): a person, for a year, at another price and with other access */
  | 'SUPPORT';

export type FeeLevelInput = {
  /** Whole kronor */
  amount: number;
  id?: string | number | null | undefined;
  kind?: FeeKind | null | undefined;
  /** Use kind; lifetime true means LIFETIME when kind is not given */
  lifetime?: boolean;
  nameEn: string;
  nameSv: string;
  /** The year a yearly fee is for; for a life fee the first year it is offered, or null */
  year?: number | null | undefined;
};

export type PaymentHow =
  | 'BANK_TRANSFER'
  | 'CASH'
  /** Paid in another application, which told us (the treasurer does not record these) */
  | 'ONLINE'
  | 'SWISH';

export type PaymentStatus =
  | 'CANCELLED'
  | 'MATCHED'
  /** Not paid yet */
  | 'OPEN'
  /** The payer says they paid; waits for the treasurer */
  | 'REPORTED';

export type SettingsInput = {
  /** A bank account for direct transfers; may be left empty if it is not used */
  bankAccount?: string | null | undefined;
  /** FGV's bankgiro: members pay to it with the reference as the message */
  bankgiro?: string | null | undefined;
  payeeName?: string | null | undefined;
  /** Email addresses, separated by commas or lines */
  recipients?: string | null | undefined;
  /** 1 to 60 */
  reminderDays: number;
  swishNumber?: string | null | undefined;
};

export type UserStatus =
  /** Has access and may log in */
  | 'ACTIVE'
  /** Switched off in Keycloak */
  | 'DEACTIVATED'
  /** Verified the address and waits for access to an application */
  | 'PENDING'
  /** Registered but has not followed the link in the verification email */
  | 'UNVERIFIED';

export type PendingApplicationsQueryVariables = Exact<{ [key: string]: never; }>;


export type PendingApplicationsQuery = { membershipApplications: Array<{ id: string, applicantName: string, applicantEmail: string | null, text: string, status: ApplicationStatus, createdAt: string }> };

export type AcceptApplicationMutationVariables = Exact<{
  id: string | number;
  spexareId?: string | number | null | undefined;
}>;


export type AcceptApplicationMutation = { acceptApplication: { id: string } };

export type RejectApplicationMutationVariables = Exact<{
  id: string | number;
  message?: string | null | undefined;
}>;


export type RejectApplicationMutation = { rejectApplication: { id: string } };

export type AuditLogQueryVariables = Exact<{
  first?: number | null | undefined;
  max?: number | null | undefined;
}>;


export type AuditLogQuery = { auditLog: Array<{ at: string, actor: string, actorName: string | null, action: string, subject: string | null, detail: string | null }> };

export type BankFormatsQueryVariables = Exact<{ [key: string]: never; }>;


export type BankFormatsQuery = { bankFormats: Array<{ id: string, name: string, charset: string, delimiter: string, headerLines: number, dateColumn: number, amountColumn: number, textColumn: number, payerColumn: number | null, dateFormat: string, decimalComma: boolean }> };

export type UnmatchedTransactionsQueryVariables = Exact<{ [key: string]: never; }>;


export type UnmatchedTransactionsQuery = { unmatchedTransactions: Array<{ id: string, bookedOn: string, amount: number, text: string | null, payer: string | null }> };

export type TransactionSuggestionsQueryVariables = Exact<{
  id: string | number;
}>;


export type TransactionSuggestionsQuery = { transactionSuggestions: Array<{ requestId: string, why: string }> };

export type ImportStatementMutationVariables = Exact<{
  formatId: string | number;
  fileName: string;
  content: string;
}>;


export type ImportStatementMutation = { importStatement: { read: number, added: number, duplicates: number, outgoing: number, matched: number, errors: Array<string> } };

export type MatchTransactionMutationVariables = Exact<{
  id: string | number;
  requestIds: Array<string | number> | string | number;
}>;


export type MatchTransactionMutation = { matchTransaction: { id: string } };

export type DismissTransactionMutationVariables = Exact<{
  id: string | number;
}>;


export type DismissTransactionMutation = { dismissTransaction: { id: string } };

export type BankFormatSaveMutationVariables = Exact<{
  input: BankFormatInput;
}>;


export type BankFormatSaveMutation = { bankFormatSave: { id: string } };

export type BankFormatDeleteMutationVariables = Exact<{
  id: string | number;
}>;


export type BankFormatDeleteMutation = { bankFormatDelete: boolean };

export type DefaultAccessQueryVariables = Exact<{
  profile?: AccessProfile | null | undefined;
}>;


export type DefaultAccessQuery = { defaultAccess: Array<{ clientId: string, name: string, ladder: Array<string>, role: string | null }> };

export type SetDefaultAccessMutationVariables = Exact<{
  profile?: AccessProfile | null | undefined;
  clientId: string;
  role?: string | null | undefined;
}>;


export type SetDefaultAccessMutation = { setDefaultAccess: { clientId: string } };

export type AllFeeLevelsQueryVariables = Exact<{ [key: string]: never; }>;


export type AllFeeLevelsQuery = { allFeeLevels: Array<{ id: string, year: number | null, kind: FeeKind, lifetime: boolean, nameSv: string, nameEn: string, amount: number, retired: boolean }> };

export type FeeLevelSaveMutationVariables = Exact<{
  input: FeeLevelInput;
}>;


export type FeeLevelSaveMutation = { feeLevelSave: { id: string } };

export type FeeLevelRetireMutationVariables = Exact<{
  id: string | number;
  retired: boolean;
}>;


export type FeeLevelRetireMutation = { feeLevelRetire: { id: string } };

export type MaintenanceJobsQueryVariables = Exact<{ [key: string]: never; }>;


export type MaintenanceJobsQuery = { maintenanceJobs: Array<{ name: string, description: string, lastRun: string | null, lastResult: string | null }> };

export type RunMaintenanceJobMutationVariables = Exact<{
  name: string;
}>;


export type RunMaintenanceJobMutation = { runMaintenanceJob: { name: string, lastResult: string | null } };

export type MembersQueryVariables = Exact<{
  year: number;
  status?: string | null | undefined;
  how?: string | null | undefined;
  was?: boolean | null | undefined;
}>;


export type MembersQuery = { members: Array<{ membershipId: string, spexareId: string, name: string | null, year: number, lifetime: boolean, status: string, how: string | null, note: string | null, optedOut: boolean, family: boolean, support: boolean }> };

export type MemberTrendQueryVariables = Exact<{ [key: string]: never; }>;


export type MemberTrendQuery = { memberTrend: Array<{ year: number, members: number, lifetime: number, joined: number }> };

export type MemberDetailQueryVariables = Exact<{
  id: string | number;
}>;


export type MemberDetailQuery = { memberDetail: { optedOut: boolean, spexare: { id: string, firstName: string, lastName: string, email: string | null }, memberships: Array<{ id: string, year: number, lifetime: boolean, status: string, how: string | null, note: string | null }>, requests: Array<{ id: string, reference: string, amount: number, paid: number, status: PaymentStatus, memberships: Array<{ year: number }> }>, emails: Array<{ kind: string, sentAt: string }> } };

export type SpexareSearchQueryVariables = Exact<{
  q: string;
}>;


export type SpexareSearchQuery = { spexareSearch: Array<{ id: string, firstName: string, lastName: string, email: string | null }> };

export type RenewalPreviewQueryVariables = Exact<{
  year: number;
  fee: string | number;
}>;


export type RenewalPreviewQuery = { renewalPreview: { year: number, count: number, sample: Array<string>, subject: string, text: string } };

export type FamilyRequestQueryVariables = Exact<{
  id: string | number;
}>;


export type FamilyRequestQuery = { paymentRequest: { id: string, reference: string, familyNote: string | null, familyMembers: Array<{ id: string, firstName: string, lastName: string }> } };

export type SendRenewalsMutationVariables = Exact<{
  year: number;
  fee: string | number;
}>;


export type SendRenewalsMutation = { sendRenewals: { sent: number, skipped: number } };

export type GrantWaiverMutationVariables = Exact<{
  spexareId: string | number;
  year: number;
  lifetime: boolean;
  note: string;
}>;


export type GrantWaiverMutation = { grantWaiver: { id: string } };

export type RecordPaymentWithoutRequestMutationVariables = Exact<{
  spexareId: string | number;
  fees: Array<string | number> | string | number;
  paidOn: string;
  amount: number;
  how: PaymentHow;
  note?: string | null | undefined;
}>;


export type RecordPaymentWithoutRequestMutation = { recordPaymentWithoutRequest: { id: string } };

export type SendPaymentLinkMutationVariables = Exact<{
  spexareId: string | number;
  fees: Array<string | number> | string | number;
}>;


export type SendPaymentLinkMutation = { sendPaymentLink: boolean };

export type AddFamilyMembersMutationVariables = Exact<{
  requestId: string | number;
  spexareIds: Array<string | number> | string | number;
}>;


export type AddFamilyMembersMutation = { addFamilyMembers: { id: string } };

export type MyMembershipQueryVariables = Exact<{ [key: string]: never; }>;


export type MyMembershipQuery = { myMembership: { linked: boolean, memberships: Array<{ id: string, type: string, year: number, lifetime: boolean, status: string }>, requests: Array<{ id: string, reference: string, amount: number, paid: number, status: PaymentStatus, createdAt: string, reportedAt: string | null, paidBy: string | null, spexareName: string | null, family: boolean, familyNote: string | null, familyIncomplete: boolean, memberships: Array<{ id: string, year: number, lifetime: boolean, status: string, spexareId: string | null }>, payee: { swishNumber: string | null, bankgiro: string | null, bankAccount: string | null, name: string } }> } };

export type MyApplicationQueryVariables = Exact<{ [key: string]: never; }>;


export type MyApplicationQuery = { myApplication: { id: string, status: ApplicationStatus, decisionMessage: string | null } | null };

export type FeeLevelsQueryVariables = Exact<{ [key: string]: never; }>;


export type FeeLevelsQuery = { feeLevels: Array<{ id: string, year: number | null, kind: FeeKind, lifetime: boolean, nameSv: string, nameEn: string, amount: number, retired: boolean }> };

export type PaymentRequestQueryVariables = Exact<{
  id: string | number;
}>;


export type PaymentRequestQuery = { paymentRequest: { swishLink: string | null, qr: string | null, id: string, reference: string, amount: number, paid: number, status: PaymentStatus, createdAt: string, reportedAt: string | null, paidBy: string | null, spexareName: string | null, family: boolean, familyNote: string | null, familyIncomplete: boolean, memberships: Array<{ id: string, year: number, lifetime: boolean, status: string, spexareId: string | null }>, payee: { swishNumber: string | null, bankgiro: string | null, bankAccount: string | null, name: string } } };

export type ApplyForMembershipMutationVariables = Exact<{
  name: string;
  text: string;
}>;


export type ApplyForMembershipMutation = { applyForMembership: { id: string } };

export type RequestPaymentMutationVariables = Exact<{
  feeLevelIds: Array<string | number> | string | number;
  familyNote?: string | null | undefined;
}>;


export type RequestPaymentMutation = { requestPayment: { id: string } };

export type ReportPaidMutationVariables = Exact<{
  id: string | number;
  paidBy?: string | null | undefined;
}>;


export type ReportPaidMutation = { reportPaid: { id: string } };

export type PaymentRequestFieldsFragment = { id: string, reference: string, amount: number, paid: number, status: PaymentStatus, createdAt: string, reportedAt: string | null, paidBy: string | null, spexareName: string | null, family: boolean, familyNote: string | null, familyIncomplete: boolean, memberships: Array<{ id: string, year: number, lifetime: boolean, status: string, spexareId: string | null }>, payee: { swishNumber: string | null, bankgiro: string | null, bankAccount: string | null, name: string } };

export type FeeLevelFieldsFragment = { id: string, year: number | null, kind: FeeKind, lifetime: boolean, nameSv: string, nameEn: string, amount: number, retired: boolean };

export type WaitingRequestsQueryVariables = Exact<{ [key: string]: never; }>;


export type WaitingRequestsQuery = { waitingPaymentRequests: Array<{ id: string, reference: string, amount: number, paid: number, status: PaymentStatus, createdAt: string, reportedAt: string | null, paidBy: string | null, spexareName: string | null, family: boolean, familyNote: string | null, familyIncomplete: boolean, memberships: Array<{ id: string, year: number, lifetime: boolean, status: string, spexareId: string | null }>, payee: { swishNumber: string | null, bankgiro: string | null, bankAccount: string | null, name: string } }> };

export type PaymentsThisYearQueryVariables = Exact<{ [key: string]: never; }>;


export type PaymentsThisYearQuery = { paymentsThisYear: Array<{ id: string, reference: string, spexareName: string | null, paidOn: string, amount: number, how: PaymentHow, note: string | null, transaction: boolean }> };

export type RecordPaymentMutationVariables = Exact<{
  requestId: string | number;
  paidOn: string;
  amount: number;
  how: PaymentHow;
  note?: string | null | undefined;
}>;


export type RecordPaymentMutation = { recordPayment: { id: string } };

export type CancelPaymentRequestMutationVariables = Exact<{
  id: string | number;
}>;


export type CancelPaymentRequestMutation = { cancelPaymentRequest: { id: string } };

export type UndoPaymentMutationVariables = Exact<{
  id: string | number;
}>;


export type UndoPaymentMutation = { undoPayment: boolean };

export type SettingsQueryVariables = Exact<{ [key: string]: never; }>;


export type SettingsQuery = { settings: { swishNumber: string | null, bankgiro: string | null, bankAccount: string | null, payeeName: string | null, reminderDays: number, recipients: Array<string> } };

export type SaveSettingsMutationVariables = Exact<{
  input: SettingsInput;
}>;


export type SaveSettingsMutation = { saveSettings: { reminderDays: number } };

export type UsersQueryVariables = Exact<{
  search?: string | null | undefined;
  status?: UserStatus | null | undefined;
  first?: number | null | undefined;
  max?: number | null | undefined;
}>;


export type UsersQuery = { users: { total: number, items: Array<{ id: string, email: string | null, displayName: string, status: UserStatus, createdAt: string | null }> } };

export type UserQueryVariables = Exact<{
  id: string | number;
}>;


export type UserQuery = { user: { id: string, email: string | null, displayName: string, enabled: boolean, emailVerified: boolean, status: UserStatus, createdAt: string | null, registrationMessage: string | null, access: Array<{ clientId: string, name: string, ladder: Array<string>, highest: string | null, consistent: boolean }> } };

export type SetUserEnabledMutationVariables = Exact<{
  id: string | number;
  enabled: boolean;
}>;


export type SetUserEnabledMutation = { setUserEnabled: { id: string } };

export type SetApplicationAccessMutationVariables = Exact<{
  userId: string | number;
  clientId: string;
  role?: string | null | undefined;
  notify?: boolean | null | undefined;
}>;


export type SetApplicationAccessMutation = { setApplicationAccess: { clientId: string } };

export type RejectUserMutationVariables = Exact<{
  id: string | number;
  message?: string | null | undefined;
  notify?: boolean | null | undefined;
}>;


export type RejectUserMutation = { rejectUser: boolean };

export type ResendVerificationMutationVariables = Exact<{
  id: string | number;
}>;


export type ResendVerificationMutation = { resendVerification: boolean };

export type SendSetPasswordEmailMutationVariables = Exact<{
  id: string | number;
}>;


export type SendSetPasswordEmailMutation = { sendSetPasswordEmail: boolean };

export type SendPasswordResetEmailMutationVariables = Exact<{
  id: string | number;
}>;


export type SendPasswordResetEmailMutation = { sendPasswordResetEmail: boolean };

export const PaymentRequestFieldsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"PaymentRequestFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"PaymentRequest"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"reference"}},{"kind":"Field","name":{"kind":"Name","value":"amount"}},{"kind":"Field","name":{"kind":"Name","value":"paid"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"reportedAt"}},{"kind":"Field","name":{"kind":"Name","value":"paidBy"}},{"kind":"Field","name":{"kind":"Name","value":"spexareName"}},{"kind":"Field","name":{"kind":"Name","value":"family"}},{"kind":"Field","name":{"kind":"Name","value":"familyNote"}},{"kind":"Field","name":{"kind":"Name","value":"familyIncomplete"}},{"kind":"Field","name":{"kind":"Name","value":"memberships"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"year"}},{"kind":"Field","name":{"kind":"Name","value":"lifetime"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"spexareId"}}]}},{"kind":"Field","name":{"kind":"Name","value":"payee"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"swishNumber"}},{"kind":"Field","name":{"kind":"Name","value":"bankgiro"}},{"kind":"Field","name":{"kind":"Name","value":"bankAccount"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode<PaymentRequestFieldsFragment, unknown>;
export const FeeLevelFieldsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"FeeLevelFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"FeeLevel"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"year"}},{"kind":"Field","name":{"kind":"Name","value":"kind"}},{"kind":"Field","name":{"kind":"Name","value":"lifetime"}},{"kind":"Field","name":{"kind":"Name","value":"nameSv"}},{"kind":"Field","name":{"kind":"Name","value":"nameEn"}},{"kind":"Field","name":{"kind":"Name","value":"amount"}},{"kind":"Field","name":{"kind":"Name","value":"retired"}}]}}]} as unknown as DocumentNode<FeeLevelFieldsFragment, unknown>;
export const PendingApplicationsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"PendingApplications"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"membershipApplications"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"applicantName"}},{"kind":"Field","name":{"kind":"Name","value":"applicantEmail"}},{"kind":"Field","name":{"kind":"Name","value":"text"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}}]}}]} as unknown as DocumentNode<PendingApplicationsQuery, PendingApplicationsQueryVariables>;
export const AcceptApplicationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"AcceptApplication"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"spexareId"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"acceptApplication"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"spexareId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"spexareId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<AcceptApplicationMutation, AcceptApplicationMutationVariables>;
export const RejectApplicationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"RejectApplication"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"message"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"rejectApplication"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"message"},"value":{"kind":"Variable","name":{"kind":"Name","value":"message"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<RejectApplicationMutation, RejectApplicationMutationVariables>;
export const AuditLogDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"AuditLog"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"first"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"max"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"auditLog"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"first"},"value":{"kind":"Variable","name":{"kind":"Name","value":"first"}}},{"kind":"Argument","name":{"kind":"Name","value":"max"},"value":{"kind":"Variable","name":{"kind":"Name","value":"max"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"at"}},{"kind":"Field","name":{"kind":"Name","value":"actor"}},{"kind":"Field","name":{"kind":"Name","value":"actorName"}},{"kind":"Field","name":{"kind":"Name","value":"action"}},{"kind":"Field","name":{"kind":"Name","value":"subject"}},{"kind":"Field","name":{"kind":"Name","value":"detail"}}]}}]}}]} as unknown as DocumentNode<AuditLogQuery, AuditLogQueryVariables>;
export const BankFormatsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"BankFormats"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"bankFormats"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"charset"}},{"kind":"Field","name":{"kind":"Name","value":"delimiter"}},{"kind":"Field","name":{"kind":"Name","value":"headerLines"}},{"kind":"Field","name":{"kind":"Name","value":"dateColumn"}},{"kind":"Field","name":{"kind":"Name","value":"amountColumn"}},{"kind":"Field","name":{"kind":"Name","value":"textColumn"}},{"kind":"Field","name":{"kind":"Name","value":"payerColumn"}},{"kind":"Field","name":{"kind":"Name","value":"dateFormat"}},{"kind":"Field","name":{"kind":"Name","value":"decimalComma"}}]}}]}}]} as unknown as DocumentNode<BankFormatsQuery, BankFormatsQueryVariables>;
export const UnmatchedTransactionsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"UnmatchedTransactions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"unmatchedTransactions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"bookedOn"}},{"kind":"Field","name":{"kind":"Name","value":"amount"}},{"kind":"Field","name":{"kind":"Name","value":"text"}},{"kind":"Field","name":{"kind":"Name","value":"payer"}}]}}]}}]} as unknown as DocumentNode<UnmatchedTransactionsQuery, UnmatchedTransactionsQueryVariables>;
export const TransactionSuggestionsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"TransactionSuggestions"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"transactionSuggestions"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"requestId"}},{"kind":"Field","name":{"kind":"Name","value":"why"}}]}}]}}]} as unknown as DocumentNode<TransactionSuggestionsQuery, TransactionSuggestionsQueryVariables>;
export const ImportStatementDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"ImportStatement"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"formatId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"fileName"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"content"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"importStatement"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"formatId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"formatId"}}},{"kind":"Argument","name":{"kind":"Name","value":"fileName"},"value":{"kind":"Variable","name":{"kind":"Name","value":"fileName"}}},{"kind":"Argument","name":{"kind":"Name","value":"content"},"value":{"kind":"Variable","name":{"kind":"Name","value":"content"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"read"}},{"kind":"Field","name":{"kind":"Name","value":"added"}},{"kind":"Field","name":{"kind":"Name","value":"duplicates"}},{"kind":"Field","name":{"kind":"Name","value":"outgoing"}},{"kind":"Field","name":{"kind":"Name","value":"matched"}},{"kind":"Field","name":{"kind":"Name","value":"errors"}}]}}]}}]} as unknown as DocumentNode<ImportStatementMutation, ImportStatementMutationVariables>;
export const MatchTransactionDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"MatchTransaction"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"requestIds"}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"matchTransaction"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"requestIds"},"value":{"kind":"Variable","name":{"kind":"Name","value":"requestIds"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<MatchTransactionMutation, MatchTransactionMutationVariables>;
export const DismissTransactionDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DismissTransaction"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"dismissTransaction"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<DismissTransactionMutation, DismissTransactionMutationVariables>;
export const BankFormatSaveDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"BankFormatSave"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"BankFormatInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"bankFormatSave"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<BankFormatSaveMutation, BankFormatSaveMutationVariables>;
export const BankFormatDeleteDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"BankFormatDelete"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"bankFormatDelete"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}]}]}}]} as unknown as DocumentNode<BankFormatDeleteMutation, BankFormatDeleteMutationVariables>;
export const DefaultAccessDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"DefaultAccess"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"profile"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"AccessProfile"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"defaultAccess"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"profile"},"value":{"kind":"Variable","name":{"kind":"Name","value":"profile"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"clientId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"ladder"}},{"kind":"Field","name":{"kind":"Name","value":"role"}}]}}]}}]} as unknown as DocumentNode<DefaultAccessQuery, DefaultAccessQueryVariables>;
export const SetDefaultAccessDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"SetDefaultAccess"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"profile"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"AccessProfile"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"clientId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"role"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"setDefaultAccess"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"profile"},"value":{"kind":"Variable","name":{"kind":"Name","value":"profile"}}},{"kind":"Argument","name":{"kind":"Name","value":"clientId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"clientId"}}},{"kind":"Argument","name":{"kind":"Name","value":"role"},"value":{"kind":"Variable","name":{"kind":"Name","value":"role"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"clientId"}}]}}]}}]} as unknown as DocumentNode<SetDefaultAccessMutation, SetDefaultAccessMutationVariables>;
export const AllFeeLevelsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"AllFeeLevels"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"allFeeLevels"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"FeeLevelFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"FeeLevelFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"FeeLevel"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"year"}},{"kind":"Field","name":{"kind":"Name","value":"kind"}},{"kind":"Field","name":{"kind":"Name","value":"lifetime"}},{"kind":"Field","name":{"kind":"Name","value":"nameSv"}},{"kind":"Field","name":{"kind":"Name","value":"nameEn"}},{"kind":"Field","name":{"kind":"Name","value":"amount"}},{"kind":"Field","name":{"kind":"Name","value":"retired"}}]}}]} as unknown as DocumentNode<AllFeeLevelsQuery, AllFeeLevelsQueryVariables>;
export const FeeLevelSaveDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"FeeLevelSave"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"FeeLevelInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"feeLevelSave"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<FeeLevelSaveMutation, FeeLevelSaveMutationVariables>;
export const FeeLevelRetireDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"FeeLevelRetire"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"retired"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"feeLevelRetire"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"retired"},"value":{"kind":"Variable","name":{"kind":"Name","value":"retired"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<FeeLevelRetireMutation, FeeLevelRetireMutationVariables>;
export const MaintenanceJobsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"MaintenanceJobs"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"maintenanceJobs"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"lastRun"}},{"kind":"Field","name":{"kind":"Name","value":"lastResult"}}]}}]}}]} as unknown as DocumentNode<MaintenanceJobsQuery, MaintenanceJobsQueryVariables>;
export const RunMaintenanceJobDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"RunMaintenanceJob"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"name"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"runMaintenanceJob"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"name"},"value":{"kind":"Variable","name":{"kind":"Name","value":"name"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"lastResult"}}]}}]}}]} as unknown as DocumentNode<RunMaintenanceJobMutation, RunMaintenanceJobMutationVariables>;
export const MembersDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Members"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"year"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"status"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"how"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"was"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"members"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"year"},"value":{"kind":"Variable","name":{"kind":"Name","value":"year"}}},{"kind":"Argument","name":{"kind":"Name","value":"status"},"value":{"kind":"Variable","name":{"kind":"Name","value":"status"}}},{"kind":"Argument","name":{"kind":"Name","value":"how"},"value":{"kind":"Variable","name":{"kind":"Name","value":"how"}}},{"kind":"Argument","name":{"kind":"Name","value":"wasMemberLastYear"},"value":{"kind":"Variable","name":{"kind":"Name","value":"was"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"membershipId"}},{"kind":"Field","name":{"kind":"Name","value":"spexareId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"year"}},{"kind":"Field","name":{"kind":"Name","value":"lifetime"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"how"}},{"kind":"Field","name":{"kind":"Name","value":"note"}},{"kind":"Field","name":{"kind":"Name","value":"optedOut"}},{"kind":"Field","name":{"kind":"Name","value":"family"}},{"kind":"Field","name":{"kind":"Name","value":"support"}}]}}]}}]} as unknown as DocumentNode<MembersQuery, MembersQueryVariables>;
export const MemberTrendDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"MemberTrend"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"memberTrend"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"year"}},{"kind":"Field","name":{"kind":"Name","value":"members"}},{"kind":"Field","name":{"kind":"Name","value":"lifetime"}},{"kind":"Field","name":{"kind":"Name","value":"joined"}}]}}]}}]} as unknown as DocumentNode<MemberTrendQuery, MemberTrendQueryVariables>;
export const MemberDetailDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"MemberDetail"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"memberDetail"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"spexareId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"spexare"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"email"}}]}},{"kind":"Field","name":{"kind":"Name","value":"optedOut"}},{"kind":"Field","name":{"kind":"Name","value":"memberships"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"year"}},{"kind":"Field","name":{"kind":"Name","value":"lifetime"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"how"}},{"kind":"Field","name":{"kind":"Name","value":"note"}}]}},{"kind":"Field","name":{"kind":"Name","value":"requests"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"reference"}},{"kind":"Field","name":{"kind":"Name","value":"amount"}},{"kind":"Field","name":{"kind":"Name","value":"paid"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"memberships"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"year"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"emails"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"kind"}},{"kind":"Field","name":{"kind":"Name","value":"sentAt"}}]}}]}}]}}]} as unknown as DocumentNode<MemberDetailQuery, MemberDetailQueryVariables>;
export const SpexareSearchDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"SpexareSearch"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"q"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"spexareSearch"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"q"},"value":{"kind":"Variable","name":{"kind":"Name","value":"q"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"email"}}]}}]}}]} as unknown as DocumentNode<SpexareSearchQuery, SpexareSearchQueryVariables>;
export const RenewalPreviewDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"RenewalPreview"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"year"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"fee"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"renewalPreview"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"year"},"value":{"kind":"Variable","name":{"kind":"Name","value":"year"}}},{"kind":"Argument","name":{"kind":"Name","value":"feeLevelId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"fee"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"year"}},{"kind":"Field","name":{"kind":"Name","value":"count"}},{"kind":"Field","name":{"kind":"Name","value":"sample"}},{"kind":"Field","name":{"kind":"Name","value":"subject"}},{"kind":"Field","name":{"kind":"Name","value":"text"}}]}}]}}]} as unknown as DocumentNode<RenewalPreviewQuery, RenewalPreviewQueryVariables>;
export const FamilyRequestDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"FamilyRequest"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"paymentRequest"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"reference"}},{"kind":"Field","name":{"kind":"Name","value":"familyNote"}},{"kind":"Field","name":{"kind":"Name","value":"familyMembers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}}]}}]}}]}}]} as unknown as DocumentNode<FamilyRequestQuery, FamilyRequestQueryVariables>;
export const SendRenewalsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"SendRenewals"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"year"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"fee"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"sendRenewals"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"year"},"value":{"kind":"Variable","name":{"kind":"Name","value":"year"}}},{"kind":"Argument","name":{"kind":"Name","value":"feeLevelId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"fee"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"sent"}},{"kind":"Field","name":{"kind":"Name","value":"skipped"}}]}}]}}]} as unknown as DocumentNode<SendRenewalsMutation, SendRenewalsMutationVariables>;
export const GrantWaiverDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"GrantWaiver"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"spexareId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"year"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"lifetime"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"note"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"grantWaiver"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"spexareId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"spexareId"}}},{"kind":"Argument","name":{"kind":"Name","value":"year"},"value":{"kind":"Variable","name":{"kind":"Name","value":"year"}}},{"kind":"Argument","name":{"kind":"Name","value":"lifetime"},"value":{"kind":"Variable","name":{"kind":"Name","value":"lifetime"}}},{"kind":"Argument","name":{"kind":"Name","value":"note"},"value":{"kind":"Variable","name":{"kind":"Name","value":"note"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<GrantWaiverMutation, GrantWaiverMutationVariables>;
export const RecordPaymentWithoutRequestDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"RecordPaymentWithoutRequest"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"spexareId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"fees"}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"paidOn"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"amount"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"how"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"PaymentHow"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"note"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"recordPaymentWithoutRequest"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"spexareId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"spexareId"}}},{"kind":"Argument","name":{"kind":"Name","value":"feeLevelIds"},"value":{"kind":"Variable","name":{"kind":"Name","value":"fees"}}},{"kind":"Argument","name":{"kind":"Name","value":"paidOn"},"value":{"kind":"Variable","name":{"kind":"Name","value":"paidOn"}}},{"kind":"Argument","name":{"kind":"Name","value":"amount"},"value":{"kind":"Variable","name":{"kind":"Name","value":"amount"}}},{"kind":"Argument","name":{"kind":"Name","value":"how"},"value":{"kind":"Variable","name":{"kind":"Name","value":"how"}}},{"kind":"Argument","name":{"kind":"Name","value":"note"},"value":{"kind":"Variable","name":{"kind":"Name","value":"note"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<RecordPaymentWithoutRequestMutation, RecordPaymentWithoutRequestMutationVariables>;
export const SendPaymentLinkDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"SendPaymentLink"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"spexareId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"fees"}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"sendPaymentLink"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"spexareId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"spexareId"}}},{"kind":"Argument","name":{"kind":"Name","value":"feeLevelIds"},"value":{"kind":"Variable","name":{"kind":"Name","value":"fees"}}}]}]}}]} as unknown as DocumentNode<SendPaymentLinkMutation, SendPaymentLinkMutationVariables>;
export const AddFamilyMembersDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"AddFamilyMembers"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"requestId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"spexareIds"}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"addFamilyMembers"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"requestId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"requestId"}}},{"kind":"Argument","name":{"kind":"Name","value":"spexareIds"},"value":{"kind":"Variable","name":{"kind":"Name","value":"spexareIds"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<AddFamilyMembersMutation, AddFamilyMembersMutationVariables>;
export const MyMembershipDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"MyMembership"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"myMembership"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"linked"}},{"kind":"Field","name":{"kind":"Name","value":"memberships"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"year"}},{"kind":"Field","name":{"kind":"Name","value":"lifetime"}},{"kind":"Field","name":{"kind":"Name","value":"status"}}]}},{"kind":"Field","name":{"kind":"Name","value":"requests"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"PaymentRequestFields"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"PaymentRequestFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"PaymentRequest"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"reference"}},{"kind":"Field","name":{"kind":"Name","value":"amount"}},{"kind":"Field","name":{"kind":"Name","value":"paid"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"reportedAt"}},{"kind":"Field","name":{"kind":"Name","value":"paidBy"}},{"kind":"Field","name":{"kind":"Name","value":"spexareName"}},{"kind":"Field","name":{"kind":"Name","value":"family"}},{"kind":"Field","name":{"kind":"Name","value":"familyNote"}},{"kind":"Field","name":{"kind":"Name","value":"familyIncomplete"}},{"kind":"Field","name":{"kind":"Name","value":"memberships"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"year"}},{"kind":"Field","name":{"kind":"Name","value":"lifetime"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"spexareId"}}]}},{"kind":"Field","name":{"kind":"Name","value":"payee"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"swishNumber"}},{"kind":"Field","name":{"kind":"Name","value":"bankgiro"}},{"kind":"Field","name":{"kind":"Name","value":"bankAccount"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode<MyMembershipQuery, MyMembershipQueryVariables>;
export const MyApplicationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"MyApplication"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"myApplication"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"decisionMessage"}}]}}]}}]} as unknown as DocumentNode<MyApplicationQuery, MyApplicationQueryVariables>;
export const FeeLevelsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"FeeLevels"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"feeLevels"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"FeeLevelFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"FeeLevelFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"FeeLevel"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"year"}},{"kind":"Field","name":{"kind":"Name","value":"kind"}},{"kind":"Field","name":{"kind":"Name","value":"lifetime"}},{"kind":"Field","name":{"kind":"Name","value":"nameSv"}},{"kind":"Field","name":{"kind":"Name","value":"nameEn"}},{"kind":"Field","name":{"kind":"Name","value":"amount"}},{"kind":"Field","name":{"kind":"Name","value":"retired"}}]}}]} as unknown as DocumentNode<FeeLevelsQuery, FeeLevelsQueryVariables>;
export const PaymentRequestDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"PaymentRequest"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"paymentRequest"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"PaymentRequestFields"}},{"kind":"Field","name":{"kind":"Name","value":"swishLink"}},{"kind":"Field","name":{"kind":"Name","value":"qr"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"PaymentRequestFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"PaymentRequest"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"reference"}},{"kind":"Field","name":{"kind":"Name","value":"amount"}},{"kind":"Field","name":{"kind":"Name","value":"paid"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"reportedAt"}},{"kind":"Field","name":{"kind":"Name","value":"paidBy"}},{"kind":"Field","name":{"kind":"Name","value":"spexareName"}},{"kind":"Field","name":{"kind":"Name","value":"family"}},{"kind":"Field","name":{"kind":"Name","value":"familyNote"}},{"kind":"Field","name":{"kind":"Name","value":"familyIncomplete"}},{"kind":"Field","name":{"kind":"Name","value":"memberships"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"year"}},{"kind":"Field","name":{"kind":"Name","value":"lifetime"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"spexareId"}}]}},{"kind":"Field","name":{"kind":"Name","value":"payee"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"swishNumber"}},{"kind":"Field","name":{"kind":"Name","value":"bankgiro"}},{"kind":"Field","name":{"kind":"Name","value":"bankAccount"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode<PaymentRequestQuery, PaymentRequestQueryVariables>;
export const ApplyForMembershipDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"ApplyForMembership"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"name"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"text"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"applyForMembership"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"name"},"value":{"kind":"Variable","name":{"kind":"Name","value":"name"}}},{"kind":"Argument","name":{"kind":"Name","value":"text"},"value":{"kind":"Variable","name":{"kind":"Name","value":"text"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<ApplyForMembershipMutation, ApplyForMembershipMutationVariables>;
export const RequestPaymentDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"RequestPayment"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"feeLevelIds"}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"familyNote"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"requestPayment"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"feeLevelIds"},"value":{"kind":"Variable","name":{"kind":"Name","value":"feeLevelIds"}}},{"kind":"Argument","name":{"kind":"Name","value":"familyNote"},"value":{"kind":"Variable","name":{"kind":"Name","value":"familyNote"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<RequestPaymentMutation, RequestPaymentMutationVariables>;
export const ReportPaidDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"ReportPaid"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"paidBy"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"reportPaid"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"paidBy"},"value":{"kind":"Variable","name":{"kind":"Name","value":"paidBy"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<ReportPaidMutation, ReportPaidMutationVariables>;
export const WaitingRequestsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"WaitingRequests"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"waitingPaymentRequests"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"PaymentRequestFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"PaymentRequestFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"PaymentRequest"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"reference"}},{"kind":"Field","name":{"kind":"Name","value":"amount"}},{"kind":"Field","name":{"kind":"Name","value":"paid"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"reportedAt"}},{"kind":"Field","name":{"kind":"Name","value":"paidBy"}},{"kind":"Field","name":{"kind":"Name","value":"spexareName"}},{"kind":"Field","name":{"kind":"Name","value":"family"}},{"kind":"Field","name":{"kind":"Name","value":"familyNote"}},{"kind":"Field","name":{"kind":"Name","value":"familyIncomplete"}},{"kind":"Field","name":{"kind":"Name","value":"memberships"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"year"}},{"kind":"Field","name":{"kind":"Name","value":"lifetime"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"spexareId"}}]}},{"kind":"Field","name":{"kind":"Name","value":"payee"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"swishNumber"}},{"kind":"Field","name":{"kind":"Name","value":"bankgiro"}},{"kind":"Field","name":{"kind":"Name","value":"bankAccount"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode<WaitingRequestsQuery, WaitingRequestsQueryVariables>;
export const PaymentsThisYearDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"PaymentsThisYear"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"paymentsThisYear"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"reference"}},{"kind":"Field","name":{"kind":"Name","value":"spexareName"}},{"kind":"Field","name":{"kind":"Name","value":"paidOn"}},{"kind":"Field","name":{"kind":"Name","value":"amount"}},{"kind":"Field","name":{"kind":"Name","value":"how"}},{"kind":"Field","name":{"kind":"Name","value":"note"}},{"kind":"Field","name":{"kind":"Name","value":"transaction"}}]}}]}}]} as unknown as DocumentNode<PaymentsThisYearQuery, PaymentsThisYearQueryVariables>;
export const RecordPaymentDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"RecordPayment"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"requestId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"paidOn"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"amount"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"how"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"PaymentHow"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"note"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"recordPayment"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"requestId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"requestId"}}},{"kind":"Argument","name":{"kind":"Name","value":"paidOn"},"value":{"kind":"Variable","name":{"kind":"Name","value":"paidOn"}}},{"kind":"Argument","name":{"kind":"Name","value":"amount"},"value":{"kind":"Variable","name":{"kind":"Name","value":"amount"}}},{"kind":"Argument","name":{"kind":"Name","value":"how"},"value":{"kind":"Variable","name":{"kind":"Name","value":"how"}}},{"kind":"Argument","name":{"kind":"Name","value":"note"},"value":{"kind":"Variable","name":{"kind":"Name","value":"note"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<RecordPaymentMutation, RecordPaymentMutationVariables>;
export const CancelPaymentRequestDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CancelPaymentRequest"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cancelPaymentRequest"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<CancelPaymentRequestMutation, CancelPaymentRequestMutationVariables>;
export const UndoPaymentDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UndoPayment"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"undoPayment"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}]}]}}]} as unknown as DocumentNode<UndoPaymentMutation, UndoPaymentMutationVariables>;
export const SettingsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Settings"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"settings"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"swishNumber"}},{"kind":"Field","name":{"kind":"Name","value":"bankgiro"}},{"kind":"Field","name":{"kind":"Name","value":"bankAccount"}},{"kind":"Field","name":{"kind":"Name","value":"payeeName"}},{"kind":"Field","name":{"kind":"Name","value":"reminderDays"}},{"kind":"Field","name":{"kind":"Name","value":"recipients"}}]}}]}}]} as unknown as DocumentNode<SettingsQuery, SettingsQueryVariables>;
export const SaveSettingsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"SaveSettings"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"SettingsInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"saveSettings"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"reminderDays"}}]}}]}}]} as unknown as DocumentNode<SaveSettingsMutation, SaveSettingsMutationVariables>;
export const UsersDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Users"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"search"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"status"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"UserStatus"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"first"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"max"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"users"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"search"},"value":{"kind":"Variable","name":{"kind":"Name","value":"search"}}},{"kind":"Argument","name":{"kind":"Name","value":"status"},"value":{"kind":"Variable","name":{"kind":"Name","value":"status"}}},{"kind":"Argument","name":{"kind":"Name","value":"first"},"value":{"kind":"Variable","name":{"kind":"Name","value":"first"}}},{"kind":"Argument","name":{"kind":"Name","value":"max"},"value":{"kind":"Variable","name":{"kind":"Name","value":"max"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"total"}},{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"displayName"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}}]}}]}}]} as unknown as DocumentNode<UsersQuery, UsersQueryVariables>;
export const UserDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"User"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"user"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"displayName"}},{"kind":"Field","name":{"kind":"Name","value":"enabled"}},{"kind":"Field","name":{"kind":"Name","value":"emailVerified"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"registrationMessage"}},{"kind":"Field","name":{"kind":"Name","value":"access"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"clientId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"ladder"}},{"kind":"Field","name":{"kind":"Name","value":"highest"}},{"kind":"Field","name":{"kind":"Name","value":"consistent"}}]}}]}}]}}]} as unknown as DocumentNode<UserQuery, UserQueryVariables>;
export const SetUserEnabledDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"SetUserEnabled"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"enabled"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"setUserEnabled"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"enabled"},"value":{"kind":"Variable","name":{"kind":"Name","value":"enabled"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<SetUserEnabledMutation, SetUserEnabledMutationVariables>;
export const SetApplicationAccessDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"SetApplicationAccess"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"userId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"clientId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"role"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"notify"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"setApplicationAccess"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"userId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"userId"}}},{"kind":"Argument","name":{"kind":"Name","value":"clientId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"clientId"}}},{"kind":"Argument","name":{"kind":"Name","value":"role"},"value":{"kind":"Variable","name":{"kind":"Name","value":"role"}}},{"kind":"Argument","name":{"kind":"Name","value":"notify"},"value":{"kind":"Variable","name":{"kind":"Name","value":"notify"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"clientId"}}]}}]}}]} as unknown as DocumentNode<SetApplicationAccessMutation, SetApplicationAccessMutationVariables>;
export const RejectUserDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"RejectUser"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"message"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"notify"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"rejectUser"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"message"},"value":{"kind":"Variable","name":{"kind":"Name","value":"message"}}},{"kind":"Argument","name":{"kind":"Name","value":"notify"},"value":{"kind":"Variable","name":{"kind":"Name","value":"notify"}}}]}]}}]} as unknown as DocumentNode<RejectUserMutation, RejectUserMutationVariables>;
export const ResendVerificationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"ResendVerification"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"resendVerification"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}]}]}}]} as unknown as DocumentNode<ResendVerificationMutation, ResendVerificationMutationVariables>;
export const SendSetPasswordEmailDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"SendSetPasswordEmail"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"sendSetPasswordEmail"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}]}]}}]} as unknown as DocumentNode<SendSetPasswordEmailMutation, SendSetPasswordEmailMutationVariables>;
export const SendPasswordResetEmailDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"SendPasswordResetEmail"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"sendPasswordResetEmail"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}]}]}}]} as unknown as DocumentNode<SendPasswordResetEmailMutation, SendPasswordResetEmailMutationVariables>;