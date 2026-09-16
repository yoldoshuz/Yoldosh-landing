import { setRequestLocale } from "next-intl/server";

import { CarsScreen } from "@/components/app/pages/CarsScreen";
import type { PageProps } from "@/types";

const Page = async ({ params }: PageProps) => {
  const { locale } = await params;
  setRequestLocale(locale);
  return <CarsScreen />;
};

export default Page;
