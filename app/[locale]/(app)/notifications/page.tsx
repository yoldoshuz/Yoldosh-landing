import { setRequestLocale } from "next-intl/server";

import { NotificationsScreen } from "@/components/app/pages/NotificationsScreen";
import type { PageProps } from "@/types";

const Page = async ({ params }: PageProps) => {
  const { locale } = await params;
  setRequestLocale(locale);
  return <NotificationsScreen />;
};

export default Page;
