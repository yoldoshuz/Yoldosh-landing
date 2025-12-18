import { use } from 'react';
import { TripDetailsPage } from '@/components/pages/trips/TripDetails';

const Page = ({ params }: { params: Promise<{ tripId: string }> }) => {
  const { tripId } = use(params);

  return <TripDetailsPage tripId={tripId} />;
};

export default Page;