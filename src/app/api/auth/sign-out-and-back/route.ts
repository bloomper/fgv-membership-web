import { type NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";

/** Ends the session here; the front page is where to land. */
export const GET = async (req: NextRequest) => {
  await auth.api.signOut({ headers: req.headers });
  return NextResponse.redirect(new URL("/", process.env.BETTER_AUTH_URL ?? req.url));
};
