import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getTranslations } from "next-intl/server";
import Link from "next/link";
import { getViewer } from "@/lib/session";
import { hasRole } from "@/lib/roles";
import { setLocale } from "@/app/actions";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("app");

  return { title: { default: t("name"), template: `%s – ${t("name")}` } };
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const locale = await getLocale();
  const t = await getTranslations("nav");
  const viewer = await getViewer();

  return (
    <html lang={locale}>
      <body>
        <NextIntlClientProvider>
          <header className="border-b border-zinc-200 dark:border-zinc-800">
            <nav className="mx-auto flex max-w-5xl flex-wrap items-center gap-4 px-4 py-3 text-sm">
              <Link href="/" className="font-semibold">Medlemskap</Link>
              {viewer && hasRole(viewer.roles, "ADMIN") && <Link href="/admin/users">{t("users")}</Link>}
              <span className="ml-auto" />
              <form action={setLocale.bind(null, locale === "sv" ? "en" : "sv")}>
                <button className="underline" type="submit">{locale === "sv" ? "English" : "Svenska"}</button>
              </form>
              {viewer ? (
                <>
                  <span>{viewer.name}</span>
                  <a href="/api/auth/sign-out-and-back">{t("logout")}</a>
                </>
              ) : (
                <>
                  <a href="/api/auth/login">{t("login")}</a>
                  <Link href="/register">{t("register")}</Link>
                </>
              )}
            </nav>
          </header>
          <main className="mx-auto max-w-5xl px-4 py-8">{children}</main>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
