import "server-only";

import { graphql } from "@/lib/graphql";

export type UserStatus = "PENDING" | "ACTIVE" | "DEACTIVATED" | "UNVERIFIED";

export type ApplicationAccess = {
  clientId: string;
  name: string;
  url: string | null;
  ladder: string[];
  held: string[];
  highest: string | null;
  enabled: boolean;
  consistent: boolean;
  defaultAccess: boolean;
};

export type AccountUser = {
  id: string;
  email: string | null;
  displayName: string;
  firstName: string | null;
  lastName: string | null;
  locale: string | null;
  enabled: boolean;
  emailVerified: boolean;
  status: UserStatus;
  createdAt: string | null;
  registrationMessage: string | null;
  access: ApplicationAccess[];
};

const USER_FIELDS = `id email displayName firstName lastName locale enabled emailVerified status createdAt registrationMessage`;
const ACCESS_FIELDS = `clientId name url ladder held highest enabled consistent defaultAccess`;

export async function listUsers(token: string, search: string, status: UserStatus | undefined, first: number, max: number) {
  const data = await graphql<{ users: { items: AccountUser[]; total: number } }>(
    token,
    `query ($search: String, $status: UserStatus, $first: Int, $max: Int) { users(search: $search, status: $status, first: $first, max: $max) { total items { ${USER_FIELDS} } } }`,
    { search: search || null, status: status ?? null, first, max },
  );

  return data.users;
}

export async function getUser(token: string, id: string) {
  const data = await graphql<{ user: AccountUser }>(
    token,
    `query ($id: ID!) { user(id: $id) { ${USER_FIELDS} access { ${ACCESS_FIELDS} } } }`,
    { id },
  );

  return data.user;
}

export const mutations = {
  setUserEnabled: `mutation ($id: ID!, $enabled: Boolean!) { setUserEnabled(id: $id, enabled: $enabled) { id } }`,
  setApplicationAccess: `mutation ($userId: ID!, $clientId: String!, $role: String) { setApplicationAccess(userId: $userId, clientId: $clientId, role: $role) { clientId } }`,
  rejectUser: `mutation ($id: ID!, $message: String) { rejectUser(id: $id, message: $message) }`,
  resendVerification: `mutation ($id: ID!) { resendVerification(id: $id) }`,
  sendSetPasswordEmail: `mutation ($id: ID!) { sendSetPasswordEmail(id: $id) }`,
  sendPasswordResetEmail: `mutation ($id: ID!) { sendPasswordResetEmail(id: $id) }`,
  updateUser: `mutation ($id: ID!, $input: UserInput!) { updateUser(id: $id, input: $input) { id } }`,
} as const;
