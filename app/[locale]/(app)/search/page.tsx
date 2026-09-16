import { setRequestLocale } from "next-intl/server";

import { SearchScreen } from "@/components/app/pages/SearchScreen";
import type { PageProps } from "@/types";

const Page = async ({ params }: PageProps) => {
  const { locale } = await params;
  setRequestLocale(locale);
  return <SearchScreen />;
};

export default Page;
