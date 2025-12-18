"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Loader2 } from "lucide-react";

import { TripDetails } from "@/components/shared/trip/TripDetails";
import { Button } from "@/components/ui/button";
import { useTripDetails } from "@/hooks/useTrips";

export const TripDetailsPage = ({ tripId }: { tripId: string }) => {
    const router = useRouter();
    const { data, isLoading, error } = useTripDetails(tripId);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <Loader2 className="size-8 animate-spin text-emerald-500-500" />
            </div>
        );
    }

    if (error || !data?.data?.trip) {
        return (
            <div className="max-w-4xl mx-auto">
                <Button variant="ghost" onClick={() => router.back()} className="mb-4">
                    <ArrowLeft className="mr-2 size-4" />
                    Back
                </Button>
                <div className="text-center text-red-500">Trip not found or error loading details.</div>
            </div>
        );
    }

    return (
        <div className="px-4 py-8 bg-neutral-100">
            <TripDetails trip={data.data.trip} />
        </div>
    );
};