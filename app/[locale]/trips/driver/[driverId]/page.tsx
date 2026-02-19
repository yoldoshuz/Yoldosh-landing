import { use } from "react";

import { DriverDetailsPage } from "@/components/pages/users/DriverDetailsPage";

const Page = ({ params }: { params: Promise<{ driverId: string }> }) => {
  const { driverId } = use(params);

  return <DriverDetailsPage driverId={driverId} />;
};

export default Page;
