import { setRequestLocale } from "next-intl/server";

import { RideScreen } from "@/components/app/pages/RideScreen";

type RidePageProps = { params: Promise<{ locale: string; tripId: string }> };

const Page = async ({ params }: RidePageProps) => {
  const { locale, tripId } = await params;
  setRequestLocale(locale);
  return <RideScreen tripId={tripId} />;
};

export default Page;
