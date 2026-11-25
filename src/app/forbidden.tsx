import { getTranslations } from "next-intl/server";

export default async function Forbidden() {
  const t = await getTranslations("errors");

  return <p role="alert">{t("forbidden")}</p>;
}
