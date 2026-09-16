import { setRequestLocale } from "next-intl/server";

import { MyTripsScreen } from "@/components/app/pages/MyTripsScreen";
import type { PageProps } from "@/types";

const Page = async ({ params }: PageProps) => {
  const { locale } = await params;
  setRequestLocale(locale);
  return <MyTripsScreen />;
};

export default Page;
