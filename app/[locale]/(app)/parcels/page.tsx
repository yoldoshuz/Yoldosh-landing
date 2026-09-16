import { setRequestLocale } from "next-intl/server";

import { ParcelsScreen } from "@/components/app/pages/ParcelsScreen";
import type { PageProps } from "@/types";

const Page = async ({ params }: PageProps) => {
  const { locale } = await params;
  setRequestLocale(locale);
  return <ParcelsScreen />;
};

export default Page;
