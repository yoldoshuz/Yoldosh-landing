import { setRequestLocale } from "next-intl/server";

import { ProfileScreen } from "@/components/app/pages/ProfileScreen";
import type { PageProps } from "@/types";

const Page = async ({ params }: PageProps) => {
  const { locale } = await params;
  setRequestLocale(locale);
  return <ProfileScreen />;
};

export default Page;
