import { setRequestLocale } from "next-intl/server";

import { WalletScreen } from "@/components/app/pages/WalletScreen";
import type { PageProps } from "@/types";

const Page = async ({ params }: PageProps) => {
  const { locale } = await params;
  setRequestLocale(locale);
  return <WalletScreen />;
};

export default Page;
