import { use } from "react";

import { PassengerDetailsPage } from "@/components/pages/users/PassengerDetailsPage";

const Page = ({ params }: { params: Promise<{ passengerId: string }> }) => {
  const { passengerId } = use(params);

  return <PassengerDetailsPage passengerId={passengerId} />;
};

export default Page;
