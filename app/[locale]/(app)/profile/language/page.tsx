import { setRequestLocale } from "next-intl/server";

import { LanguageScreen } from "@/components/app/pages/LanguageScreen";
import type { PageProps } from "@/types";

const Page = async ({ params }: PageProps) => {
  const { locale } = await params;
  setRequestLocale(locale);
  return <LanguageScreen />;
};

export default Page;
