import Image from "next/image";
import {getTranslations} from "next-intl/server";
import {Button} from "@bloomper/fgv-web-ui/ui/button";
import {formatAmount} from "@/utils/format";

/**
 * How to pay a request: the amount, the reference, where to pay, and on a phone a button that opens Swish with it all
 * filled in; elsewhere the QR code of the same. Used for a member's own request and behind a personal link.
 */
export async function PaymentDetails({amount, reference, swishNumber, bankgiro, bankAccount, swishLink, qr}: {
    amount: number;
    reference: string;
    swishNumber?: string | null;
    bankgiro?: string | null;
    bankAccount?: string | null;
    swishLink?: string | null;
    qr?: string | null;
}) {
    const t = await getTranslations("Pay");

    return (
        <div className="space-y-4">
            <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1">
                <dt className="text-muted-foreground">{t("amount")}</dt>
                <dd className="font-semibold">{formatAmount(amount)}</dd>
                <dt className="text-muted-foreground">{t("reference")}</dt>
                <dd className="font-mono font-semibold break-all">{reference}</dd>
                {swishNumber && <><dt className="text-muted-foreground">Swish</dt><dd>{swishNumber}</dd></>}
                {bankgiro && <><dt className="text-muted-foreground">{t("bankgiro")}</dt><dd>{bankgiro}</dd></>}
                {bankAccount && <><dt className="text-muted-foreground">{t("bankAccount")}</dt><dd>{bankAccount}</dd></>}
            </dl>
            <p className="text-sm text-muted-foreground">{t("keepReference")}</p>
            {swishLink && (
                <Button className="md:hidden" nativeButton={false} render={<a href={swishLink}/>}>{t("openSwish")}</Button>
            )}
            {qr && <Image className="hidden size-52 md:block" src={qr} alt={t("qrAlt")} width={208} height={208} unoptimized/>}
        </div>
    );
}
