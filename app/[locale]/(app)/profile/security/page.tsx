import { setRequestLocale } from "next-intl/server";

import { SecurityScreen } from "@/components/app/pages/SecurityScreen";
import type { PageProps } from "@/types";

const Page = async ({ params }: PageProps) => {
  const { locale } = await params;
  setRequestLocale(locale);
  return <SecurityScreen />;
};

export default Page;
