import { Suspense } from "react";
import { Loader2 } from "lucide-react";
import { SearchPage } from "@/components/pages/trips/TripPage";

const Page = () => {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center">
          <Loader2 className="size-8 animate-spin text-emerald-500" />
        </div>
      }
    >
      <SearchPage />
    </Suspense>
  );
};

export default Page;
