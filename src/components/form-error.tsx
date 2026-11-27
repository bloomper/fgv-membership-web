import { useTranslations } from "next-intl";

/** A validation message under a field; the message is a key under {@code Validation}. */
export function FormError({ message }: { message?: string }) {
  const t = useTranslations("Validation");

  return message ? (
    <p
      role="alert"
      className="text-destructive text-sm"
    >
      {t(message)}
    </p>
  ) : null;
}
