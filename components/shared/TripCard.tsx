import { Trip } from "@/lib/api";
import { Calendar, Users, Star } from "lucide-react";
import { Card } from "@/components/ui/card";

interface TripCardProps {
    trip: Trip;
    onClick: () => void;
}

export const TripCard = ({ trip, onClick }: TripCardProps) => {
    const departureDate = new Date(trip.departure_ts);
    const formattedDate = departureDate.toLocaleDateString("ru-RU", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });
    const formattedTime = departureDate.toLocaleTimeString("ru-RU", {
        hour: "2-digit",
        minute: "2-digit",
    });

    return (
        <Card
            className="p-5 hover:border-teal-500 transition-colors cursor-pointer"
            onClick={onClick}
        >
            <div className="flex flex-col gap-4">
                {/* Route */}
                <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-3">
                        <span className="size-3 rounded-full border-2 border-teal-500" />
                        <h3 className="font-semibold">
                            {trip.from_location.address}
                        </h3>
                    </div>
                    <div className="w-0.5 h-6 bg-neutral-300 ml-1" />
                    <div className="flex items-center gap-3">
                        <span className="size-3 rounded-full bg-muted-foreground" />
                        <h3 className="font-semibold">
                            {trip.to_location.address}
                        </h3>
                    </div>
                </div>

                {/* Info */}
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                        <Calendar className="size-4" />
                        <span>
                            {formattedDate} {formattedTime}
                        </span>
                    </div>
                    <div className="flex items-center gap-1">
                        <Users className="size-4" />
                        <span>{trip.seats_available}</span>
                    </div>
                </div>

                {/* Driver & Price */}
                <div className="flex items-center justify-between pt-3 border-t">
                    <div className="flex items-center gap-2">
                        <div className="size-10 rounded-full bg-teal-100 flex items-center justify-center">
                            <span className="text-teal-600 font-semibold">
                                {trip.driver.firstName[0]}
                            </span>
                        </div>
                        <div>
                            <p className="font-medium text-sm">
                                {trip.driver.firstName}
                            </p>
                            <div className="flex items-center gap-1">
                                <Star className="size-3 fill-yellow-400 text-yellow-400" />
                                <span className="text-xs text-muted-foreground">
                                    {trip.driver.rating.toFixed(1)}
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="text-xs text-muted-foreground">From</p>
                        <p className="text-xl font-bold">
                            {trip.price.amount.toLocaleString()}
                            <span className="text-sm font-normal text-muted-foreground ml-1">
                                UZS
                            </span>
                        </p>
                    </div>
                </div>
            </div>
        </Card>
    );
};