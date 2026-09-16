import { setRequestLocale } from "next-intl/server";

import { ChatsScreen } from "@/components/app/pages/ChatsScreen";
import type { PageProps } from "@/types";

const Page = async ({ params }: PageProps) => {
  const { locale } = await params;
  setRequestLocale(locale);
  return <ChatsScreen />;
};

export default Page;
