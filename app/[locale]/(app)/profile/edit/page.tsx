import { setRequestLocale } from "next-intl/server";

import { ProfileEditScreen } from "@/components/app/pages/ProfileEditScreen";
import type { PageProps } from "@/types";

const Page = async ({ params }: PageProps) => {
  const { locale } = await params;
  setRequestLocale(locale);
  return <ProfileEditScreen />;
};

export default Page;
