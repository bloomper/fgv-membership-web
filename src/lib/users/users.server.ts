import "server-only";

import { graphql } from "@/gql";
import type { UserStatus } from "@/gql/graphql";
import { runMutation, runQuery } from "@/lib/graphql.server";

// The accounts of FGV's applications (admin.graphqls), which an administrator keeps.

export const USER_STATUSES: UserStatus[] = ["PENDING", "ACTIVE", "DEACTIVATED", "UNVERIFIED"];

const UsersQuery = graphql(`
    query Users($search: String, $status: UserStatus, $first: Int, $max: Int) {
        users(search: $search, status: $status, first: $first, max: $max) {
            total
            items { id email displayName status createdAt }
        }
    }
`);

const UserQuery = graphql(`
    query User($id: ID!) {
        user(id: $id) {
            id email displayName enabled emailVerified status createdAt registrationMessage
            access { clientId name ladder highest consistent }
        }
    }
`);

const SetUserEnabledMutation = graphql(`
    mutation SetUserEnabled($id: ID!, $enabled: Boolean!) { setUserEnabled(id: $id, enabled: $enabled) { id } }
`);

const SetApplicationAccessMutation = graphql(`
    mutation SetApplicationAccess($userId: ID!, $clientId: String!, $role: String, $notify: Boolean) {
        setApplicationAccess(userId: $userId, clientId: $clientId, role: $role, notify: $notify) { clientId }
    }
`);

const RejectUserMutation = graphql(`
    mutation RejectUser($id: ID!, $message: String, $notify: Boolean) { rejectUser(id: $id, message: $message, notify: $notify) }
`);

const ResendVerificationMutation = graphql(`
    mutation ResendVerification($id: ID!) { resendVerification(id: $id) }
`);

const SendSetPasswordEmailMutation = graphql(`
    mutation SendSetPasswordEmail($id: ID!) { sendSetPasswordEmail(id: $id) }
`);

const SendPasswordResetEmailMutation = graphql(`
    mutation SendPasswordResetEmail($id: ID!) { sendPasswordResetEmail(id: $id) }
`);

export async function listUsers(search: string, status: UserStatus | undefined, first: number, max: number) {
  return (await runQuery(UsersQuery, { search: search || null, status: status ?? null, first, max }))?.users;
}

export async function getUser(id: string) {
  return (await runQuery(UserQuery, { id }))?.user;
}

export async function setUserEnabled(id: string, enabled: boolean) {
  await runMutation(SetUserEnabledMutation, { id, enabled });
}

export async function setApplicationAccess(userId: string, clientId: string, role: string | null, notify: boolean) {
  await runMutation(SetApplicationAccessMutation, { userId, clientId, role, notify });
}

export async function rejectUser(id: string, message: string | null, notify: boolean) {
  await runMutation(RejectUserMutation, { id, message, notify });
}

export async function resendVerification(id: string) {
  await runMutation(ResendVerificationMutation, { id });
}

export async function sendSetPasswordEmail(id: string) {
  await runMutation(SendSetPasswordEmailMutation, { id });
}

export async function sendPasswordResetEmail(id: string) {
  await runMutation(SendPasswordResetEmailMutation, { id });
}
