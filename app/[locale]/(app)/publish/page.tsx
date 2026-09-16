import { setRequestLocale } from "next-intl/server";

import { PublishScreen } from "@/components/app/pages/PublishScreen";
import type { PageProps } from "@/types";

const Page = async ({ params }: PageProps) => {
  const { locale } = await params;
  setRequestLocale(locale);
  return <PublishScreen />;
};

export default Page;
