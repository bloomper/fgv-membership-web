import { NextRequest, NextResponse } from "next/server";
import { apiFetch } from "@/lib/api.server";

const KINDS = new Set(["members", "payments"]);

/**
 * The member list (board) or the year's payments (treasurer) as an Excel workbook, fetched with the user's token so the
 * browser never holds it. The server decides who may download which.
 */
export async function GET(request: NextRequest, { params }: { params: Promise<{ kind: string }> }) {
  const { kind } = await params;

  if (!KINDS.has(kind)) {
    return NextResponse.json({ error: "Invalid request" }, { status: 404 });
  }

  const year = Number(request.nextUrl.searchParams.get("year")) || new Date().getFullYear();
  const response = await apiFetch(`/api/exports/${kind}.xlsx?year=${year}`);

  if (!response.ok) {
    return NextResponse.json({ error: "Download failed" }, { status: response.status });
  }
  return new NextResponse(await response.arrayBuffer(), {
    headers: {
      "Content-Type": response.headers.get("content-type") ?? "application/octet-stream",
      "Content-Disposition":
        response.headers.get("content-disposition") ?? `attachment; filename="${kind}-${year}.xlsx"`,
      "Cache-Control": "no-store",
      "Content-Security-Policy": "default-src 'none'; sandbox",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
