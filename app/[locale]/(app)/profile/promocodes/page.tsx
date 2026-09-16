import { setRequestLocale } from "next-intl/server";

import { PromocodesScreen } from "@/components/app/pages/PromocodesScreen";
import type { PageProps } from "@/types";

const Page = async ({ params }: PageProps) => {
  const { locale } = await params;
  setRequestLocale(locale);
  return <PromocodesScreen />;
};

export default Page;
