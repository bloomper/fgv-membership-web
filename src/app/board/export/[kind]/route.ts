import { NextResponse } from "next/server";
import { getViewer } from "@/lib/session";
import { hasRole } from "@/lib/roles";

/** Passes the API's Excel export on with the viewer's token: the browser never holds it. */
export async function GET(request: Request, { params }: { params: Promise<{ kind: string }> }) {
  const { kind } = await params;
  const viewer = await getViewer();

  if (!viewer) {
    return NextResponse.redirect(new URL(`/api/auth/login?returnTo=/board/members`, request.url));
  }
  if (!["members", "payments"].includes(kind) || !hasRole(viewer.roles, kind === "members" ? "BOARD" : "TREASURER")) {
    return new NextResponse(null, { status: 403 });
  }

  const year = new URL(request.url).searchParams.get("year") ?? String(new Date().getFullYear());
  const base = (process.env.API_GRAPHQL_ENDPOINT ?? "http://localhost:8087/api/graphql").replace(/\/graphql$/, "");
  const response = await fetch(`${base}/exports/${kind}.xlsx?year=${encodeURIComponent(year)}`, { headers: { Authorization: `Bearer ${viewer.accessToken}` }, cache: "no-store" });

  if (!response.ok) {
    return new NextResponse(null, { status: response.status });
  }
  return new NextResponse(response.body, {
    headers: {
      "Content-Type": response.headers.get("Content-Type") ?? "application/octet-stream",
      "Content-Disposition": response.headers.get("Content-Disposition") ?? `attachment; filename="${kind}-${year}.xlsx"`,
    },
  });
}
