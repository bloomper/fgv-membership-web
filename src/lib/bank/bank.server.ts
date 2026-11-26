import "server-only";

import {graphql} from "@/gql";
import type {BankFormatInput} from "@/gql/graphql";
import {runMutation, runQuery} from "@/lib/graphql.server";

// Bank statements and the transactions in them (bank.graphqls), which the treasurer matches and an administrator sets up.

const BankFormatsQuery = graphql(`
    query BankFormats {
        bankFormats { id name charset delimiter headerLines dateColumn amountColumn textColumn payerColumn dateFormat decimalComma }
    }
`);

const UnmatchedTransactionsQuery = graphql(`
    query UnmatchedTransactions {
        unmatchedTransactions { id bookedOn amount text payer }
    }
`);

const TransactionSuggestionsQuery = graphql(`
    query TransactionSuggestions($id: ID!) { transactionSuggestions(id: $id) { requestId why } }
`);

const ImportStatementMutation = graphql(`
    mutation ImportStatement($formatId: ID!, $fileName: String!, $content: String!) {
        importStatement(formatId: $formatId, fileName: $fileName, content: $content) { read added duplicates outgoing matched errors }
    }
`);

const MatchTransactionMutation = graphql(`
    mutation MatchTransaction($id: ID!, $requestIds: [ID!]!) { matchTransaction(id: $id, requestIds: $requestIds) { id } }
`);

const DismissTransactionMutation = graphql(`
    mutation DismissTransaction($id: ID!) { dismissTransaction(id: $id) { id } }
`);

const BankFormatSaveMutation = graphql(`
    mutation BankFormatSave($input: BankFormatInput!) { bankFormatSave(input: $input) { id } }
`);

const BankFormatDeleteMutation = graphql(`
    mutation BankFormatDelete($id: ID!) { bankFormatDelete(id: $id) }
`);

export async function getBankFormats() {
    return (await runQuery(BankFormatsQuery, {}))?.bankFormats ?? [];
}

export async function getUnmatchedTransactions() {
    return (await runQuery(UnmatchedTransactionsQuery, {}))?.unmatchedTransactions ?? [];
}

export async function getTransactionSuggestions(id: string) {
    return (await runQuery(TransactionSuggestionsQuery, {id}))?.transactionSuggestions ?? [];
}

export async function importStatement(formatId: string, fileName: string, content: string) {
    return (await runMutation(ImportStatementMutation, {formatId, fileName, content}))?.importStatement;
}

export async function matchTransaction(id: string, requestIds: string[]) {
    await runMutation(MatchTransactionMutation, {id, requestIds});
}

export async function dismissTransaction(id: string) {
    await runMutation(DismissTransactionMutation, {id});
}

export async function saveBankFormat(input: BankFormatInput) {
    await runMutation(BankFormatSaveMutation, {input});
}

export async function deleteBankFormat(id: string) {
    await runMutation(BankFormatDeleteMutation, {id});
}
