import { type NextRequest } from "next/server";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { returnPath } from "@/lib/return-path";

/** Starts signing in with Keycloak, in the user's language, and comes back to `returnTo`. */
export const GET = async (req: NextRequest) => {
  const back = returnPath(req.nextUrl.searchParams.get("returnTo"));
  const locale = req.cookies.get("locale")?.value === "en" ? "en" : "sv";
  const { url } = await auth.api.signInSocial({
    body: { provider: "keycloak", callbackURL: back, additionalParams: { ui_locales: locale } },
  });

  if (!url) {
    throw new Error("Keycloak did not return an authorization URL");
  }
  redirect(url);
};
