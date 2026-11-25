import "server-only";

import { headers } from "next/headers";
import { auth } from "@/auth";
import { rolesOf, type MembershipRole } from "@/lib/roles";

export type Viewer = {
  name: string;
  email: string;
  accessToken: string;
  roles: MembershipRole[];
};

/** Who is looking, with the access token for the API; undefined when not logged in. */
export async function getViewer(): Promise<Viewer | undefined> {
  const requestHeaders = await headers();
  const session = await auth.api.getSession({ headers: requestHeaders });

  if (!session) {
    return undefined;
  }

  try {
    const token = await auth.api.getAccessToken({ body: { useAccountCookie: true }, headers: requestHeaders });

    if (!token?.accessToken) {
      return undefined;
    }
    return { name: session.user.name, email: session.user.email, accessToken: token.accessToken, roles: rolesOf(token.accessToken) };
  } catch {
    return undefined;
  }
}
