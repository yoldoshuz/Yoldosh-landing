import { setRequestLocale } from "next-intl/server";

import { ReviewsScreen } from "@/components/app/pages/ReviewsScreen";
import type { PageProps } from "@/types";

const Page = async ({ params }: PageProps) => {
  const { locale } = await params;
  setRequestLocale(locale);
  return <ReviewsScreen />;
};

export default Page;
