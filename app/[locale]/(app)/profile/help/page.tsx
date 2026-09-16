import { setRequestLocale } from "next-intl/server";

import { HelpScreen } from "@/components/app/pages/HelpScreen";
import type { PageProps } from "@/types";

const Page = async ({ params }: PageProps) => {
  const { locale } = await params;
  setRequestLocale(locale);
  return <HelpScreen />;
};

export default Page;
