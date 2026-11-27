/* eslint-disable */
import * as types from './graphql';
import type { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 * Learn more about it here: https://the-guild.dev/graphql/codegen/plugins/presets/preset-client#reducing-bundle-size
 */
type Documents = {
    "\n    query PendingApplications {\n        membershipApplications { id applicantName applicantEmail text status createdAt }\n    }\n": typeof types.PendingApplicationsDocument,
    "\n    mutation AcceptApplication($id: ID!, $spexareId: ID) { acceptApplication(id: $id, spexareId: $spexareId) { id } }\n": typeof types.AcceptApplicationDocument,
    "\n    mutation RejectApplication($id: ID!, $message: String) { rejectApplication(id: $id, message: $message) { id } }\n": typeof types.RejectApplicationDocument,
    "\n    query AuditLog($first: Int, $max: Int) { auditLog(first: $first, max: $max) { at actor actorName action subject detail } }\n": typeof types.AuditLogDocument,
    "\n    query BankFormats {\n        bankFormats { id name charset delimiter headerLines dateColumn amountColumn textColumn payerColumn dateFormat decimalComma }\n    }\n": typeof types.BankFormatsDocument,
    "\n    query UnmatchedTransactions {\n        unmatchedTransactions { id bookedOn amount text payer }\n    }\n": typeof types.UnmatchedTransactionsDocument,
    "\n    query TransactionSuggestions($id: ID!) { transactionSuggestions(id: $id) { requestId why } }\n": typeof types.TransactionSuggestionsDocument,
    "\n    mutation ImportStatement($formatId: ID!, $fileName: String!, $content: String!) {\n        importStatement(formatId: $formatId, fileName: $fileName, content: $content) { read added duplicates outgoing matched errors }\n    }\n": typeof types.ImportStatementDocument,
    "\n    mutation MatchTransaction($id: ID!, $requestIds: [ID!]!) { matchTransaction(id: $id, requestIds: $requestIds) { id } }\n": typeof types.MatchTransactionDocument,
    "\n    mutation DismissTransaction($id: ID!) { dismissTransaction(id: $id) { id } }\n": typeof types.DismissTransactionDocument,
    "\n    mutation BankFormatSave($input: BankFormatInput!) { bankFormatSave(input: $input) { id } }\n": typeof types.BankFormatSaveDocument,
    "\n    mutation BankFormatDelete($id: ID!) { bankFormatDelete(id: $id) }\n": typeof types.BankFormatDeleteDocument,
    "\n    query DefaultAccess($profile: AccessProfile) { defaultAccess(profile: $profile) { clientId name ladder role } }\n": typeof types.DefaultAccessDocument,
    "\n    mutation SetDefaultAccess($profile: AccessProfile, $clientId: String!, $role: String) {\n        setDefaultAccess(profile: $profile, clientId: $clientId, role: $role) { clientId }\n    }\n": typeof types.SetDefaultAccessDocument,
    "\n    query AllFeeLevels { allFeeLevels { ...FeeLevelFields } }\n": typeof types.AllFeeLevelsDocument,
    "\n    mutation FeeLevelSave($input: FeeLevelInput!) { feeLevelSave(input: $input) { id } }\n": typeof types.FeeLevelSaveDocument,
    "\n    mutation FeeLevelRetire($id: ID!, $retired: Boolean!) { feeLevelRetire(id: $id, retired: $retired) { id } }\n": typeof types.FeeLevelRetireDocument,
    "\n    query MaintenanceJobs { maintenanceJobs { name description lastRun lastResult } }\n": typeof types.MaintenanceJobsDocument,
    "\n    mutation RunMaintenanceJob($name: String!) { runMaintenanceJob(name: $name) { name lastResult } }\n": typeof types.RunMaintenanceJobDocument,
    "\n    query Members($year: Int!, $status: String, $how: String, $was: Boolean) {\n        members(year: $year, status: $status, how: $how, wasMemberLastYear: $was) {\n            membershipId spexareId name year lifetime status how note optedOut family support\n        }\n    }\n": typeof types.MembersDocument,
    "\n    query MemberTrend { memberTrend { year members lifetime joined } }\n": typeof types.MemberTrendDocument,
    "\n    query MemberDetail($id: ID!) {\n        memberDetail(spexareId: $id) {\n            spexare { id firstName lastName email }\n            optedOut\n            memberships { id year lifetime status how note }\n            requests { id reference amount paid status memberships { year } }\n            emails { kind sentAt }\n        }\n    }\n": typeof types.MemberDetailDocument,
    "\n    query SpexareSearch($q: String!) { spexareSearch(q: $q) { id firstName lastName email } }\n": typeof types.SpexareSearchDocument,
    "\n    query RenewalPreview($year: Int!, $fee: ID!) {\n        renewalPreview(year: $year, feeLevelId: $fee) { year count sample subject text }\n    }\n": typeof types.RenewalPreviewDocument,
    "\n    query FamilyRequest($id: ID!) {\n        paymentRequest(id: $id) { id reference familyNote familyMembers { id firstName lastName } }\n    }\n": typeof types.FamilyRequestDocument,
    "\n    mutation SendRenewals($year: Int!, $fee: ID!) { sendRenewals(year: $year, feeLevelId: $fee) { sent skipped } }\n": typeof types.SendRenewalsDocument,
    "\n    mutation GrantWaiver($spexareId: ID!, $year: Int!, $lifetime: Boolean!, $note: String!) {\n        grantWaiver(spexareId: $spexareId, year: $year, lifetime: $lifetime, note: $note) { id }\n    }\n": typeof types.GrantWaiverDocument,
    "\n    mutation RecordPaymentWithoutRequest($spexareId: ID!, $fees: [ID!]!, $paidOn: String!, $amount: Int!, $how: PaymentHow!, $note: String) {\n        recordPaymentWithoutRequest(spexareId: $spexareId, feeLevelIds: $fees, paidOn: $paidOn, amount: $amount, how: $how, note: $note) { id }\n    }\n": typeof types.RecordPaymentWithoutRequestDocument,
    "\n    mutation SendPaymentLink($spexareId: ID!, $fees: [ID!]!) { sendPaymentLink(spexareId: $spexareId, feeLevelIds: $fees) }\n": typeof types.SendPaymentLinkDocument,
    "\n    mutation AddFamilyMembers($requestId: ID!, $spexareIds: [ID!]!) { addFamilyMembers(requestId: $requestId, spexareIds: $spexareIds) { id } }\n": typeof types.AddFamilyMembersDocument,
    "\n    query MyMembership {\n        myMembership {\n            linked\n            memberships { id type year lifetime status }\n            requests { ...PaymentRequestFields }\n        }\n    }\n": typeof types.MyMembershipDocument,
    "\n    query MyApplication {\n        myApplication { id status decisionMessage }\n    }\n": typeof types.MyApplicationDocument,
    "\n    query FeeLevels {\n        feeLevels { ...FeeLevelFields }\n    }\n": typeof types.FeeLevelsDocument,
    "\n    query PaymentRequest($id: ID!) {\n        paymentRequest(id: $id) { ...PaymentRequestFields swishLink qr }\n    }\n": typeof types.PaymentRequestDocument,
    "\n    mutation ApplyForMembership($name: String!, $text: String!) { applyForMembership(name: $name, text: $text) { id } }\n": typeof types.ApplyForMembershipDocument,
    "\n    mutation RequestPayment($feeLevelIds: [ID!]!, $familyNote: String) { requestPayment(feeLevelIds: $feeLevelIds, familyNote: $familyNote) { id } }\n": typeof types.RequestPaymentDocument,
    "\n    mutation ReportPaid($id: ID!, $paidBy: String) { reportPaid(id: $id, paidBy: $paidBy) { id } }\n": typeof types.ReportPaidDocument,
    "\n    fragment PaymentRequestFields on PaymentRequest {\n        id reference amount paid status createdAt reportedAt paidBy spexareName\n        family familyNote familyIncomplete\n        memberships { id year lifetime status spexareId }\n        payee { swishNumber bankgiro bankAccount name }\n    }\n": typeof types.PaymentRequestFieldsFragmentDoc,
    "\n    fragment FeeLevelFields on FeeLevel {\n        id year kind lifetime nameSv nameEn amount retired\n    }\n": typeof types.FeeLevelFieldsFragmentDoc,
    "\n    query WaitingRequests {\n        waitingPaymentRequests { ...PaymentRequestFields }\n    }\n": typeof types.WaitingRequestsDocument,
    "\n    query PaymentsThisYear {\n        paymentsThisYear { id reference spexareName paidOn amount how note transaction }\n    }\n": typeof types.PaymentsThisYearDocument,
    "\n    mutation RecordPayment($requestId: ID!, $paidOn: String!, $amount: Int!, $how: PaymentHow!, $note: String) {\n        recordPayment(requestId: $requestId, paidOn: $paidOn, amount: $amount, how: $how, note: $note) { id }\n    }\n": typeof types.RecordPaymentDocument,
    "\n    mutation CancelPaymentRequest($id: ID!) { cancelPaymentRequest(id: $id) { id } }\n": typeof types.CancelPaymentRequestDocument,
    "\n    mutation UndoPayment($id: ID!) { undoPayment(id: $id) }\n": typeof types.UndoPaymentDocument,
    "\n    query Settings { settings { swishNumber bankgiro bankAccount payeeName reminderDays recipients } }\n": typeof types.SettingsDocument,
    "\n    mutation SaveSettings($input: SettingsInput!) { saveSettings(input: $input) { reminderDays } }\n": typeof types.SaveSettingsDocument,
    "\n    query Users($search: String, $status: UserStatus, $first: Int, $max: Int) {\n        users(search: $search, status: $status, first: $first, max: $max) {\n            total\n            items { id email displayName status createdAt }\n        }\n    }\n": typeof types.UsersDocument,
    "\n    query User($id: ID!) {\n        user(id: $id) {\n            id email displayName enabled emailVerified status createdAt registrationMessage\n            access { clientId name ladder highest consistent }\n        }\n    }\n": typeof types.UserDocument,
    "\n    mutation SetUserEnabled($id: ID!, $enabled: Boolean!) { setUserEnabled(id: $id, enabled: $enabled) { id } }\n": typeof types.SetUserEnabledDocument,
    "\n    mutation SetApplicationAccess($userId: ID!, $clientId: String!, $role: String, $notify: Boolean) {\n        setApplicationAccess(userId: $userId, clientId: $clientId, role: $role, notify: $notify) { clientId }\n    }\n": typeof types.SetApplicationAccessDocument,
    "\n    mutation RejectUser($id: ID!, $message: String, $notify: Boolean) { rejectUser(id: $id, message: $message, notify: $notify) }\n": typeof types.RejectUserDocument,
    "\n    mutation ResendVerification($id: ID!) { resendVerification(id: $id) }\n": typeof types.ResendVerificationDocument,
    "\n    mutation SendSetPasswordEmail($id: ID!) { sendSetPasswordEmail(id: $id) }\n": typeof types.SendSetPasswordEmailDocument,
    "\n    mutation SendPasswordResetEmail($id: ID!) { sendPasswordResetEmail(id: $id) }\n": typeof types.SendPasswordResetEmailDocument,
};
const documents: Documents = {
    "\n    query PendingApplications {\n        membershipApplications { id applicantName applicantEmail text status createdAt }\n    }\n": types.PendingApplicationsDocument,
    "\n    mutation AcceptApplication($id: ID!, $spexareId: ID) { acceptApplication(id: $id, spexareId: $spexareId) { id } }\n": types.AcceptApplicationDocument,
    "\n    mutation RejectApplication($id: ID!, $message: String) { rejectApplication(id: $id, message: $message) { id } }\n": types.RejectApplicationDocument,
    "\n    query AuditLog($first: Int, $max: Int) { auditLog(first: $first, max: $max) { at actor actorName action subject detail } }\n": types.AuditLogDocument,
    "\n    query BankFormats {\n        bankFormats { id name charset delimiter headerLines dateColumn amountColumn textColumn payerColumn dateFormat decimalComma }\n    }\n": types.BankFormatsDocument,
    "\n    query UnmatchedTransactions {\n        unmatchedTransactions { id bookedOn amount text payer }\n    }\n": types.UnmatchedTransactionsDocument,
    "\n    query TransactionSuggestions($id: ID!) { transactionSuggestions(id: $id) { requestId why } }\n": types.TransactionSuggestionsDocument,
    "\n    mutation ImportStatement($formatId: ID!, $fileName: String!, $content: String!) {\n        importStatement(formatId: $formatId, fileName: $fileName, content: $content) { read added duplicates outgoing matched errors }\n    }\n": types.ImportStatementDocument,
    "\n    mutation MatchTransaction($id: ID!, $requestIds: [ID!]!) { matchTransaction(id: $id, requestIds: $requestIds) { id } }\n": types.MatchTransactionDocument,
    "\n    mutation DismissTransaction($id: ID!) { dismissTransaction(id: $id) { id } }\n": types.DismissTransactionDocument,
    "\n    mutation BankFormatSave($input: BankFormatInput!) { bankFormatSave(input: $input) { id } }\n": types.BankFormatSaveDocument,
    "\n    mutation BankFormatDelete($id: ID!) { bankFormatDelete(id: $id) }\n": types.BankFormatDeleteDocument,
    "\n    query DefaultAccess($profile: AccessProfile) { defaultAccess(profile: $profile) { clientId name ladder role } }\n": types.DefaultAccessDocument,
    "\n    mutation SetDefaultAccess($profile: AccessProfile, $clientId: String!, $role: String) {\n        setDefaultAccess(profile: $profile, clientId: $clientId, role: $role) { clientId }\n    }\n": types.SetDefaultAccessDocument,
    "\n    query AllFeeLevels { allFeeLevels { ...FeeLevelFields } }\n": types.AllFeeLevelsDocument,
    "\n    mutation FeeLevelSave($input: FeeLevelInput!) { feeLevelSave(input: $input) { id } }\n": types.FeeLevelSaveDocument,
    "\n    mutation FeeLevelRetire($id: ID!, $retired: Boolean!) { feeLevelRetire(id: $id, retired: $retired) { id } }\n": types.FeeLevelRetireDocument,
    "\n    query MaintenanceJobs { maintenanceJobs { name description lastRun lastResult } }\n": types.MaintenanceJobsDocument,
    "\n    mutation RunMaintenanceJob($name: String!) { runMaintenanceJob(name: $name) { name lastResult } }\n": types.RunMaintenanceJobDocument,
    "\n    query Members($year: Int!, $status: String, $how: String, $was: Boolean) {\n        members(year: $year, status: $status, how: $how, wasMemberLastYear: $was) {\n            membershipId spexareId name year lifetime status how note optedOut family support\n        }\n    }\n": types.MembersDocument,
    "\n    query MemberTrend { memberTrend { year members lifetime joined } }\n": types.MemberTrendDocument,
    "\n    query MemberDetail($id: ID!) {\n        memberDetail(spexareId: $id) {\n            spexare { id firstName lastName email }\n            optedOut\n            memberships { id year lifetime status how note }\n            requests { id reference amount paid status memberships { year } }\n            emails { kind sentAt }\n        }\n    }\n": types.MemberDetailDocument,
    "\n    query SpexareSearch($q: String!) { spexareSearch(q: $q) { id firstName lastName email } }\n": types.SpexareSearchDocument,
    "\n    query RenewalPreview($year: Int!, $fee: ID!) {\n        renewalPreview(year: $year, feeLevelId: $fee) { year count sample subject text }\n    }\n": types.RenewalPreviewDocument,
    "\n    query FamilyRequest($id: ID!) {\n        paymentRequest(id: $id) { id reference familyNote familyMembers { id firstName lastName } }\n    }\n": types.FamilyRequestDocument,
    "\n    mutation SendRenewals($year: Int!, $fee: ID!) { sendRenewals(year: $year, feeLevelId: $fee) { sent skipped } }\n": types.SendRenewalsDocument,
    "\n    mutation GrantWaiver($spexareId: ID!, $year: Int!, $lifetime: Boolean!, $note: String!) {\n        grantWaiver(spexareId: $spexareId, year: $year, lifetime: $lifetime, note: $note) { id }\n    }\n": types.GrantWaiverDocument,
    "\n    mutation RecordPaymentWithoutRequest($spexareId: ID!, $fees: [ID!]!, $paidOn: String!, $amount: Int!, $how: PaymentHow!, $note: String) {\n        recordPaymentWithoutRequest(spexareId: $spexareId, feeLevelIds: $fees, paidOn: $paidOn, amount: $amount, how: $how, note: $note) { id }\n    }\n": types.RecordPaymentWithoutRequestDocument,
    "\n    mutation SendPaymentLink($spexareId: ID!, $fees: [ID!]!) { sendPaymentLink(spexareId: $spexareId, feeLevelIds: $fees) }\n": types.SendPaymentLinkDocument,
    "\n    mutation AddFamilyMembers($requestId: ID!, $spexareIds: [ID!]!) { addFamilyMembers(requestId: $requestId, spexareIds: $spexareIds) { id } }\n": types.AddFamilyMembersDocument,
    "\n    query MyMembership {\n        myMembership {\n            linked\n            memberships { id type year lifetime status }\n            requests { ...PaymentRequestFields }\n        }\n    }\n": types.MyMembershipDocument,
    "\n    query MyApplication {\n        myApplication { id status decisionMessage }\n    }\n": types.MyApplicationDocument,
    "\n    query FeeLevels {\n        feeLevels { ...FeeLevelFields }\n    }\n": types.FeeLevelsDocument,
    "\n    query PaymentRequest($id: ID!) {\n        paymentRequest(id: $id) { ...PaymentRequestFields swishLink qr }\n    }\n": types.PaymentRequestDocument,
    "\n    mutation ApplyForMembership($name: String!, $text: String!) { applyForMembership(name: $name, text: $text) { id } }\n": types.ApplyForMembershipDocument,
    "\n    mutation RequestPayment($feeLevelIds: [ID!]!, $familyNote: String) { requestPayment(feeLevelIds: $feeLevelIds, familyNote: $familyNote) { id } }\n": types.RequestPaymentDocument,
    "\n    mutation ReportPaid($id: ID!, $paidBy: String) { reportPaid(id: $id, paidBy: $paidBy) { id } }\n": types.ReportPaidDocument,
    "\n    fragment PaymentRequestFields on PaymentRequest {\n        id reference amount paid status createdAt reportedAt paidBy spexareName\n        family familyNote familyIncomplete\n        memberships { id year lifetime status spexareId }\n        payee { swishNumber bankgiro bankAccount name }\n    }\n": types.PaymentRequestFieldsFragmentDoc,
    "\n    fragment FeeLevelFields on FeeLevel {\n        id year kind lifetime nameSv nameEn amount retired\n    }\n": types.FeeLevelFieldsFragmentDoc,
    "\n    query WaitingRequests {\n        waitingPaymentRequests { ...PaymentRequestFields }\n    }\n": types.WaitingRequestsDocument,
    "\n    query PaymentsThisYear {\n        paymentsThisYear { id reference spexareName paidOn amount how note transaction }\n    }\n": types.PaymentsThisYearDocument,
    "\n    mutation RecordPayment($requestId: ID!, $paidOn: String!, $amount: Int!, $how: PaymentHow!, $note: String) {\n        recordPayment(requestId: $requestId, paidOn: $paidOn, amount: $amount, how: $how, note: $note) { id }\n    }\n": types.RecordPaymentDocument,
    "\n    mutation CancelPaymentRequest($id: ID!) { cancelPaymentRequest(id: $id) { id } }\n": types.CancelPaymentRequestDocument,
    "\n    mutation UndoPayment($id: ID!) { undoPayment(id: $id) }\n": types.UndoPaymentDocument,
    "\n    query Settings { settings { swishNumber bankgiro bankAccount payeeName reminderDays recipients } }\n": types.SettingsDocument,
    "\n    mutation SaveSettings($input: SettingsInput!) { saveSettings(input: $input) { reminderDays } }\n": types.SaveSettingsDocument,
    "\n    query Users($search: String, $status: UserStatus, $first: Int, $max: Int) {\n        users(search: $search, status: $status, first: $first, max: $max) {\n            total\n            items { id email displayName status createdAt }\n        }\n    }\n": types.UsersDocument,
    "\n    query User($id: ID!) {\n        user(id: $id) {\n            id email displayName enabled emailVerified status createdAt registrationMessage\n            access { clientId name ladder highest consistent }\n        }\n    }\n": types.UserDocument,
    "\n    mutation SetUserEnabled($id: ID!, $enabled: Boolean!) { setUserEnabled(id: $id, enabled: $enabled) { id } }\n": types.SetUserEnabledDocument,
    "\n    mutation SetApplicationAccess($userId: ID!, $clientId: String!, $role: String, $notify: Boolean) {\n        setApplicationAccess(userId: $userId, clientId: $clientId, role: $role, notify: $notify) { clientId }\n    }\n": types.SetApplicationAccessDocument,
    "\n    mutation RejectUser($id: ID!, $message: String, $notify: Boolean) { rejectUser(id: $id, message: $message, notify: $notify) }\n": types.RejectUserDocument,
    "\n    mutation ResendVerification($id: ID!) { resendVerification(id: $id) }\n": types.ResendVerificationDocument,
    "\n    mutation SendSetPasswordEmail($id: ID!) { sendSetPasswordEmail(id: $id) }\n": types.SendSetPasswordEmailDocument,
    "\n    mutation SendPasswordResetEmail($id: ID!) { sendPasswordResetEmail(id: $id) }\n": types.SendPasswordResetEmailDocument,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = graphql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function graphql(source: string): unknown;

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    query PendingApplications {\n        membershipApplications { id applicantName applicantEmail text status createdAt }\n    }\n"): (typeof documents)["\n    query PendingApplications {\n        membershipApplications { id applicantName applicantEmail text status createdAt }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    mutation AcceptApplication($id: ID!, $spexareId: ID) { acceptApplication(id: $id, spexareId: $spexareId) { id } }\n"): (typeof documents)["\n    mutation AcceptApplication($id: ID!, $spexareId: ID) { acceptApplication(id: $id, spexareId: $spexareId) { id } }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    mutation RejectApplication($id: ID!, $message: String) { rejectApplication(id: $id, message: $message) { id } }\n"): (typeof documents)["\n    mutation RejectApplication($id: ID!, $message: String) { rejectApplication(id: $id, message: $message) { id } }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    query AuditLog($first: Int, $max: Int) { auditLog(first: $first, max: $max) { at actor actorName action subject detail } }\n"): (typeof documents)["\n    query AuditLog($first: Int, $max: Int) { auditLog(first: $first, max: $max) { at actor actorName action subject detail } }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    query BankFormats {\n        bankFormats { id name charset delimiter headerLines dateColumn amountColumn textColumn payerColumn dateFormat decimalComma }\n    }\n"): (typeof documents)["\n    query BankFormats {\n        bankFormats { id name charset delimiter headerLines dateColumn amountColumn textColumn payerColumn dateFormat decimalComma }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    query UnmatchedTransactions {\n        unmatchedTransactions { id bookedOn amount text payer }\n    }\n"): (typeof documents)["\n    query UnmatchedTransactions {\n        unmatchedTransactions { id bookedOn amount text payer }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    query TransactionSuggestions($id: ID!) { transactionSuggestions(id: $id) { requestId why } }\n"): (typeof documents)["\n    query TransactionSuggestions($id: ID!) { transactionSuggestions(id: $id) { requestId why } }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    mutation ImportStatement($formatId: ID!, $fileName: String!, $content: String!) {\n        importStatement(formatId: $formatId, fileName: $fileName, content: $content) { read added duplicates outgoing matched errors }\n    }\n"): (typeof documents)["\n    mutation ImportStatement($formatId: ID!, $fileName: String!, $content: String!) {\n        importStatement(formatId: $formatId, fileName: $fileName, content: $content) { read added duplicates outgoing matched errors }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    mutation MatchTransaction($id: ID!, $requestIds: [ID!]!) { matchTransaction(id: $id, requestIds: $requestIds) { id } }\n"): (typeof documents)["\n    mutation MatchTransaction($id: ID!, $requestIds: [ID!]!) { matchTransaction(id: $id, requestIds: $requestIds) { id } }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    mutation DismissTransaction($id: ID!) { dismissTransaction(id: $id) { id } }\n"): (typeof documents)["\n    mutation DismissTransaction($id: ID!) { dismissTransaction(id: $id) { id } }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    mutation BankFormatSave($input: BankFormatInput!) { bankFormatSave(input: $input) { id } }\n"): (typeof documents)["\n    mutation BankFormatSave($input: BankFormatInput!) { bankFormatSave(input: $input) { id } }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    mutation BankFormatDelete($id: ID!) { bankFormatDelete(id: $id) }\n"): (typeof documents)["\n    mutation BankFormatDelete($id: ID!) { bankFormatDelete(id: $id) }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    query DefaultAccess($profile: AccessProfile) { defaultAccess(profile: $profile) { clientId name ladder role } }\n"): (typeof documents)["\n    query DefaultAccess($profile: AccessProfile) { defaultAccess(profile: $profile) { clientId name ladder role } }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    mutation SetDefaultAccess($profile: AccessProfile, $clientId: String!, $role: String) {\n        setDefaultAccess(profile: $profile, clientId: $clientId, role: $role) { clientId }\n    }\n"): (typeof documents)["\n    mutation SetDefaultAccess($profile: AccessProfile, $clientId: String!, $role: String) {\n        setDefaultAccess(profile: $profile, clientId: $clientId, role: $role) { clientId }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    query AllFeeLevels { allFeeLevels { ...FeeLevelFields } }\n"): (typeof documents)["\n    query AllFeeLevels { allFeeLevels { ...FeeLevelFields } }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    mutation FeeLevelSave($input: FeeLevelInput!) { feeLevelSave(input: $input) { id } }\n"): (typeof documents)["\n    mutation FeeLevelSave($input: FeeLevelInput!) { feeLevelSave(input: $input) { id } }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    mutation FeeLevelRetire($id: ID!, $retired: Boolean!) { feeLevelRetire(id: $id, retired: $retired) { id } }\n"): (typeof documents)["\n    mutation FeeLevelRetire($id: ID!, $retired: Boolean!) { feeLevelRetire(id: $id, retired: $retired) { id } }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    query MaintenanceJobs { maintenanceJobs { name description lastRun lastResult } }\n"): (typeof documents)["\n    query MaintenanceJobs { maintenanceJobs { name description lastRun lastResult } }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    mutation RunMaintenanceJob($name: String!) { runMaintenanceJob(name: $name) { name lastResult } }\n"): (typeof documents)["\n    mutation RunMaintenanceJob($name: String!) { runMaintenanceJob(name: $name) { name lastResult } }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    query Members($year: Int!, $status: String, $how: String, $was: Boolean) {\n        members(year: $year, status: $status, how: $how, wasMemberLastYear: $was) {\n            membershipId spexareId name year lifetime status how note optedOut family support\n        }\n    }\n"): (typeof documents)["\n    query Members($year: Int!, $status: String, $how: String, $was: Boolean) {\n        members(year: $year, status: $status, how: $how, wasMemberLastYear: $was) {\n            membershipId spexareId name year lifetime status how note optedOut family support\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    query MemberTrend { memberTrend { year members lifetime joined } }\n"): (typeof documents)["\n    query MemberTrend { memberTrend { year members lifetime joined } }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    query MemberDetail($id: ID!) {\n        memberDetail(spexareId: $id) {\n            spexare { id firstName lastName email }\n            optedOut\n            memberships { id year lifetime status how note }\n            requests { id reference amount paid status memberships { year } }\n            emails { kind sentAt }\n        }\n    }\n"): (typeof documents)["\n    query MemberDetail($id: ID!) {\n        memberDetail(spexareId: $id) {\n            spexare { id firstName lastName email }\n            optedOut\n            memberships { id year lifetime status how note }\n            requests { id reference amount paid status memberships { year } }\n            emails { kind sentAt }\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    query SpexareSearch($q: String!) { spexareSearch(q: $q) { id firstName lastName email } }\n"): (typeof documents)["\n    query SpexareSearch($q: String!) { spexareSearch(q: $q) { id firstName lastName email } }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    query RenewalPreview($year: Int!, $fee: ID!) {\n        renewalPreview(year: $year, feeLevelId: $fee) { year count sample subject text }\n    }\n"): (typeof documents)["\n    query RenewalPreview($year: Int!, $fee: ID!) {\n        renewalPreview(year: $year, feeLevelId: $fee) { year count sample subject text }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    query FamilyRequest($id: ID!) {\n        paymentRequest(id: $id) { id reference familyNote familyMembers { id firstName lastName } }\n    }\n"): (typeof documents)["\n    query FamilyRequest($id: ID!) {\n        paymentRequest(id: $id) { id reference familyNote familyMembers { id firstName lastName } }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    mutation SendRenewals($year: Int!, $fee: ID!) { sendRenewals(year: $year, feeLevelId: $fee) { sent skipped } }\n"): (typeof documents)["\n    mutation SendRenewals($year: Int!, $fee: ID!) { sendRenewals(year: $year, feeLevelId: $fee) { sent skipped } }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    mutation GrantWaiver($spexareId: ID!, $year: Int!, $lifetime: Boolean!, $note: String!) {\n        grantWaiver(spexareId: $spexareId, year: $year, lifetime: $lifetime, note: $note) { id }\n    }\n"): (typeof documents)["\n    mutation GrantWaiver($spexareId: ID!, $year: Int!, $lifetime: Boolean!, $note: String!) {\n        grantWaiver(spexareId: $spexareId, year: $year, lifetime: $lifetime, note: $note) { id }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    mutation RecordPaymentWithoutRequest($spexareId: ID!, $fees: [ID!]!, $paidOn: String!, $amount: Int!, $how: PaymentHow!, $note: String) {\n        recordPaymentWithoutRequest(spexareId: $spexareId, feeLevelIds: $fees, paidOn: $paidOn, amount: $amount, how: $how, note: $note) { id }\n    }\n"): (typeof documents)["\n    mutation RecordPaymentWithoutRequest($spexareId: ID!, $fees: [ID!]!, $paidOn: String!, $amount: Int!, $how: PaymentHow!, $note: String) {\n        recordPaymentWithoutRequest(spexareId: $spexareId, feeLevelIds: $fees, paidOn: $paidOn, amount: $amount, how: $how, note: $note) { id }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    mutation SendPaymentLink($spexareId: ID!, $fees: [ID!]!) { sendPaymentLink(spexareId: $spexareId, feeLevelIds: $fees) }\n"): (typeof documents)["\n    mutation SendPaymentLink($spexareId: ID!, $fees: [ID!]!) { sendPaymentLink(spexareId: $spexareId, feeLevelIds: $fees) }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    mutation AddFamilyMembers($requestId: ID!, $spexareIds: [ID!]!) { addFamilyMembers(requestId: $requestId, spexareIds: $spexareIds) { id } }\n"): (typeof documents)["\n    mutation AddFamilyMembers($requestId: ID!, $spexareIds: [ID!]!) { addFamilyMembers(requestId: $requestId, spexareIds: $spexareIds) { id } }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    query MyMembership {\n        myMembership {\n            linked\n            memberships { id type year lifetime status }\n            requests { ...PaymentRequestFields }\n        }\n    }\n"): (typeof documents)["\n    query MyMembership {\n        myMembership {\n            linked\n            memberships { id type year lifetime status }\n            requests { ...PaymentRequestFields }\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    query MyApplication {\n        myApplication { id status decisionMessage }\n    }\n"): (typeof documents)["\n    query MyApplication {\n        myApplication { id status decisionMessage }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    query FeeLevels {\n        feeLevels { ...FeeLevelFields }\n    }\n"): (typeof documents)["\n    query FeeLevels {\n        feeLevels { ...FeeLevelFields }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    query PaymentRequest($id: ID!) {\n        paymentRequest(id: $id) { ...PaymentRequestFields swishLink qr }\n    }\n"): (typeof documents)["\n    query PaymentRequest($id: ID!) {\n        paymentRequest(id: $id) { ...PaymentRequestFields swishLink qr }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    mutation ApplyForMembership($name: String!, $text: String!) { applyForMembership(name: $name, text: $text) { id } }\n"): (typeof documents)["\n    mutation ApplyForMembership($name: String!, $text: String!) { applyForMembership(name: $name, text: $text) { id } }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    mutation RequestPayment($feeLevelIds: [ID!]!, $familyNote: String) { requestPayment(feeLevelIds: $feeLevelIds, familyNote: $familyNote) { id } }\n"): (typeof documents)["\n    mutation RequestPayment($feeLevelIds: [ID!]!, $familyNote: String) { requestPayment(feeLevelIds: $feeLevelIds, familyNote: $familyNote) { id } }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    mutation ReportPaid($id: ID!, $paidBy: String) { reportPaid(id: $id, paidBy: $paidBy) { id } }\n"): (typeof documents)["\n    mutation ReportPaid($id: ID!, $paidBy: String) { reportPaid(id: $id, paidBy: $paidBy) { id } }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    fragment PaymentRequestFields on PaymentRequest {\n        id reference amount paid status createdAt reportedAt paidBy spexareName\n        family familyNote familyIncomplete\n        memberships { id year lifetime status spexareId }\n        payee { swishNumber bankgiro bankAccount name }\n    }\n"): (typeof documents)["\n    fragment PaymentRequestFields on PaymentRequest {\n        id reference amount paid status createdAt reportedAt paidBy spexareName\n        family familyNote familyIncomplete\n        memberships { id year lifetime status spexareId }\n        payee { swishNumber bankgiro bankAccount name }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    fragment FeeLevelFields on FeeLevel {\n        id year kind lifetime nameSv nameEn amount retired\n    }\n"): (typeof documents)["\n    fragment FeeLevelFields on FeeLevel {\n        id year kind lifetime nameSv nameEn amount retired\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    query WaitingRequests {\n        waitingPaymentRequests { ...PaymentRequestFields }\n    }\n"): (typeof documents)["\n    query WaitingRequests {\n        waitingPaymentRequests { ...PaymentRequestFields }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    query PaymentsThisYear {\n        paymentsThisYear { id reference spexareName paidOn amount how note transaction }\n    }\n"): (typeof documents)["\n    query PaymentsThisYear {\n        paymentsThisYear { id reference spexareName paidOn amount how note transaction }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    mutation RecordPayment($requestId: ID!, $paidOn: String!, $amount: Int!, $how: PaymentHow!, $note: String) {\n        recordPayment(requestId: $requestId, paidOn: $paidOn, amount: $amount, how: $how, note: $note) { id }\n    }\n"): (typeof documents)["\n    mutation RecordPayment($requestId: ID!, $paidOn: String!, $amount: Int!, $how: PaymentHow!, $note: String) {\n        recordPayment(requestId: $requestId, paidOn: $paidOn, amount: $amount, how: $how, note: $note) { id }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    mutation CancelPaymentRequest($id: ID!) { cancelPaymentRequest(id: $id) { id } }\n"): (typeof documents)["\n    mutation CancelPaymentRequest($id: ID!) { cancelPaymentRequest(id: $id) { id } }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    mutation UndoPayment($id: ID!) { undoPayment(id: $id) }\n"): (typeof documents)["\n    mutation UndoPayment($id: ID!) { undoPayment(id: $id) }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    query Settings { settings { swishNumber bankgiro bankAccount payeeName reminderDays recipients } }\n"): (typeof documents)["\n    query Settings { settings { swishNumber bankgiro bankAccount payeeName reminderDays recipients } }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    mutation SaveSettings($input: SettingsInput!) { saveSettings(input: $input) { reminderDays } }\n"): (typeof documents)["\n    mutation SaveSettings($input: SettingsInput!) { saveSettings(input: $input) { reminderDays } }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    query Users($search: String, $status: UserStatus, $first: Int, $max: Int) {\n        users(search: $search, status: $status, first: $first, max: $max) {\n            total\n            items { id email displayName status createdAt }\n        }\n    }\n"): (typeof documents)["\n    query Users($search: String, $status: UserStatus, $first: Int, $max: Int) {\n        users(search: $search, status: $status, first: $first, max: $max) {\n            total\n            items { id email displayName status createdAt }\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    query User($id: ID!) {\n        user(id: $id) {\n            id email displayName enabled emailVerified status createdAt registrationMessage\n            access { clientId name ladder highest consistent }\n        }\n    }\n"): (typeof documents)["\n    query User($id: ID!) {\n        user(id: $id) {\n            id email displayName enabled emailVerified status createdAt registrationMessage\n            access { clientId name ladder highest consistent }\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    mutation SetUserEnabled($id: ID!, $enabled: Boolean!) { setUserEnabled(id: $id, enabled: $enabled) { id } }\n"): (typeof documents)["\n    mutation SetUserEnabled($id: ID!, $enabled: Boolean!) { setUserEnabled(id: $id, enabled: $enabled) { id } }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    mutation SetApplicationAccess($userId: ID!, $clientId: String!, $role: String, $notify: Boolean) {\n        setApplicationAccess(userId: $userId, clientId: $clientId, role: $role, notify: $notify) { clientId }\n    }\n"): (typeof documents)["\n    mutation SetApplicationAccess($userId: ID!, $clientId: String!, $role: String, $notify: Boolean) {\n        setApplicationAccess(userId: $userId, clientId: $clientId, role: $role, notify: $notify) { clientId }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    mutation RejectUser($id: ID!, $message: String, $notify: Boolean) { rejectUser(id: $id, message: $message, notify: $notify) }\n"): (typeof documents)["\n    mutation RejectUser($id: ID!, $message: String, $notify: Boolean) { rejectUser(id: $id, message: $message, notify: $notify) }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    mutation ResendVerification($id: ID!) { resendVerification(id: $id) }\n"): (typeof documents)["\n    mutation ResendVerification($id: ID!) { resendVerification(id: $id) }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    mutation SendSetPasswordEmail($id: ID!) { sendSetPasswordEmail(id: $id) }\n"): (typeof documents)["\n    mutation SendSetPasswordEmail($id: ID!) { sendSetPasswordEmail(id: $id) }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    mutation SendPasswordResetEmail($id: ID!) { sendPasswordResetEmail(id: $id) }\n"): (typeof documents)["\n    mutation SendPasswordResetEmail($id: ID!) { sendPasswordResetEmail(id: $id) }\n"];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;