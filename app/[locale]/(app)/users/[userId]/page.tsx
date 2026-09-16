import { setRequestLocale } from "next-intl/server";

import { PublicProfileScreen } from "@/components/app/pages/PublicProfileScreen";

type UserPageProps = { params: Promise<{ locale: string; userId: string }> };

const Page = async ({ params }: UserPageProps) => {
  const { locale, userId } = await params;
  setRequestLocale(locale);
  return <PublicProfileScreen userId={userId} />;
};

export default Page;
