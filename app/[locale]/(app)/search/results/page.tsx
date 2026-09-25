import { setRequestLocale } from "next-intl/server";

import { SearchResultsScreen } from "@/components/app/pages/SearchResultsScreen";
import type { PageProps } from "@/types";

const Page = async ({ params }: PageProps) => {
  const { locale } = await params;
  setRequestLocale(locale);
  return <SearchResultsScreen />;
};

export default Page;
