import { getFormatter, getTranslations } from "next-intl/server";
import Link from "next/link";
import { notFound } from "next/navigation";
import { personalLinkEndpoint } from "@/lib/board";
import { LinkActions } from "./link-actions";

type Page = {
  reference: string; amount: number; paid: number; status: "OPEN" | "REPORTED" | "MATCHED" | "CANCELLED"; years: number[];
  swishNumber: string | null; bankgiro: string | null; bankAccount: string | null; swishLink: string | null; qr: string | null; optedOut: boolean;
};

/** A personal link: the payment request and nothing else, for people who pay without logging in. */
export default async function PersonalLinkPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const t = await getTranslations("pay");
  const tl = await getTranslations("personal");
  const format = await getFormatter();
  const response = await fetch(`${personalLinkEndpoint()}/${encodeURIComponent(token)}`, { cache: "no-store" });

  if (response.status === 404) {
    notFound();
  }
  if (!response.ok) {
    throw new Error("The payment page could not be loaded");
  }

  const page = (await response.json()) as Page;
  const open = page.status === "OPEN" || page.status === "REPORTED";

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">{t("payTitle")}</h1>
      <p>{page.years.join(", ")}</p>
      {page.status === "MATCHED" && <p role="status" className="font-semibold">{t("confirmed")}</p>}
      {page.status === "CANCELLED" && <p role="status">{t("cancelled")}</p>}
      {open && (
        <>
          <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1">
            <dt>{t("amount")}</dt><dd className="font-semibold">{format.number(page.amount - page.paid)} kr</dd>
            <dt>{t("reference")}</dt><dd className="font-mono font-semibold">{page.reference}</dd>
            {page.swishNumber && <><dt>Swish</dt><dd>{page.swishNumber}</dd></>}
            {page.bankgiro && <><dt>{t("bankgiro")}</dt><dd>{page.bankgiro}</dd></>}
            {page.bankAccount && <><dt>{t("bankAccount")}</dt><dd>{page.bankAccount}</dd></>}
          </dl>
          <p className="text-sm">{t("keepReference")}</p>
          {page.swishLink && <p className="md:hidden"><a className="button" href={page.swishLink}>{t("openSwish")}</a></p>}
          {page.qr && (
            // eslint-disable-next-line @next/next/no-img-element
            <img className="hidden h-52 w-52 md:block" src={page.qr} alt={t("qrAlt")} />
          )}
          {page.status === "REPORTED" ? <p role="status" className="font-semibold">{t("waitingForConfirmation")}</p> : (
            <LinkActions token={token} labels={{ paidBy: t("paidBy"), paidByHint: t("paidByHint"), submit: t("iHavePaid"), done: t("reported") }} />
          )}
        </>
      )}
      <section className="space-y-2 border-t border-zinc-200 pt-4 text-sm dark:border-zinc-800">
        {page.optedOut ? <p>{tl("optedOut")}</p> : <LinkActions token={token} optOutOnly labels={{ paidBy: "", paidByHint: "", submit: "", done: "", optOut: tl("optOut"), optedOut: tl("optedOut") }} />}
        <p>{tl("account")} <a className="underline" href="/api/auth/login">{tl("login")}</a> · <Link className="underline" href="/register">{tl("register")}</Link></p>
      </section>
    </div>
  );
}
