import { setRequestLocale } from "next-intl/server";

import { NotificationSettingsScreen } from "@/components/app/pages/NotificationSettingsScreen";
import type { PageProps } from "@/types";

const Page = async ({ params }: PageProps) => {
  const { locale } = await params;
  setRequestLocale(locale);
  return <NotificationSettingsScreen />;
};

export default Page;
