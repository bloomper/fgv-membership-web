import "server-only";

import { forbidden, redirect } from "next/navigation";
import { getViewer, type Viewer } from "@/lib/session";
import { hasRole, type MembershipRole } from "@/lib/roles";

/** The logged-in viewer with the role, or a redirect to log in, or a 403. */
export async function requireRole(role: MembershipRole, returnTo: string): Promise<Viewer> {
  const viewer = await getViewer();

  if (!viewer) {
    redirect(`/api/auth/login?returnTo=${encodeURIComponent(returnTo)}`);
  }
  if (!hasRole(viewer.roles, role)) {
    forbidden();
  }
  return viewer;
}
