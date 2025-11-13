import { Trip } from "@/types/";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
    Calendar,
    Users,
    Star,
    Car,
    Clock,
    MapPin
} from "lucide-react";

interface TripDetailsProps {
    trip: Trip;
}

export const TripDetails = ({ trip }: TripDetailsProps) => {
    const departureDate = new Date(trip.departure_ts);
    const formattedDate = departureDate.toLocaleDateString("ru-RU", {
        weekday: "long",
        day: "2-digit",
        month: "long",
        year: "numeric",
    });
    const formattedTime = departureDate.toLocaleTimeString("ru-RU", {
        hour: "2-digit",
        minute: "2-digit",
    });

    return (
        <div className="max-w-4xl mx-auto">
            <Card className="p-6 md:p-8">
                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-2xl md:text-3xl font-bold mb-2">
                        Trip Details
                    </h1>
                    <p className="text-muted-foreground">
                        Review the trip information before booking
                    </p>
                </div>

                <Separator className="my-6" />

                {/* Route */}
                <div className="mb-6">
                    <h2 className="text-xl font-semibold mb-4">Route</h2>
                    <div className="flex flex-col gap-3">
                        <div className="flex items-start gap-3">
                            <div className="mt-1">
                                <div className="size-4 rounded-full border-2 border-teal-500" />
                            </div>
                            <div>
                                <p className="font-semibold text-lg">
                                    {trip.from_region_id}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    {trip.from_region_id}
                                </p>
                            </div>
                        </div>
                        <div className="w-0.5 h-12 bg-neutral-300 ml-1.5" />
                        <div className="flex items-start gap-3">
                            <div className="mt-1">
                                <div className="size-4 rounded-full bg-muted-foreground" />
                            </div>
                            <div>
                                <p className="font-semibold text-lg">
                                    {trip.to_location.address}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    {trip.to_location.region.nameRu}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <Separator className="my-6" />

                {/* Trip Info */}
                <div className="mb-6">
                    <h2 className="text-xl font-semibold mb-4">Trip Information</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-center gap-3">
                            <Calendar className="size-5 text-teal-500" />
                            <div>
                                <p className="text-sm text-muted-foreground">Departure</p>
                                <p className="font-medium">
                                    {formattedDate} at {formattedTime}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <Users className="size-5 text-teal-500" />
                            <div>
                                <p className="text-sm text-muted-foreground">
                                    Available Seats
                                </p>
                                <p className="font-medium">{trip.seats_available}</p>
                            </div>
                        </div>
                        {trip.distance && (
                            <div className="flex items-center gap-3">
                                <MapPin className="size-5 text-teal-500" />
                                <div>
                                    <p className="text-sm text-muted-foreground">Distance</p>
                                    <p className="font-medium">{trip.distance} km</p>
                                </div>
                            </div>
                        )}
                        {trip.duration && (
                            <div className="flex items-center gap-3">
                                <Clock className="size-5 text-teal-500" />
                                <div>
                                    <p className="text-sm text-muted-foreground">Duration</p>
                                    <p className="font-medium">
                                        {Math.floor(trip.duration / 60)}h {trip.duration % 60}m
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <Separator className="my-6" />

                {/* Driver Info */}
                <div className="mb-6">
                    <h2 className="text-xl font-semibold mb-4">Driver</h2>
                    <div className="flex items-center gap-4">
                        <div className="size-16 rounded-full bg-teal-100 flex items-center justify-center">
                            <span className="text-teal-600 font-bold text-2xl">
                                {trip.driver.firstName[0]}
                            </span>
                        </div>
                        <div>
                            <p className="font-semibold text-lg">
                                {trip.driver.firstName} {trip.driver.lastName}
                            </p>
                            <div className="flex items-center gap-2 mt-1">
                                <Star className="size-4 fill-yellow-400 text-yellow-400" />
                                <span className="font-medium">
                                    {trip.driver.rating.toFixed(1)}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <Separator className="my-6" />

                {/* Car Info */}
                <div className="mb-6">
                    <h2 className="text-xl font-semibold mb-4">Vehicle</h2>
                    <div className="flex items-center gap-3">
                        <Car className="size-5 text-teal-500" />
                        <div>
                            <p className="font-medium">
                                {trip.car.make} {trip.car.model}
                            </p>
                            <p className="text-sm text-muted-foreground">
                                {trip.car.color}
                            </p>
                        </div>
                    </div>
                </div>

                {trip.comment && (
                    <>
                        <Separator className="my-6" />
                        <div className="mb-6">
                            <h2 className="text-xl font-semibold mb-4">
                                Additional Information
                            </h2>
                            <p className="text-muted-foreground">{trip.comment}</p>
                        </div>
                    </>
                )}

                <Separator className="my-6" />

                {/* Price & Action */}
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm text-muted-foreground">Price per person</p>
                        <p className="text-3xl font-bold">
                            {trip.price.amount.toLocaleString()}
                            <span className="text-lg font-normal text-muted-foreground ml-2">
                                UZS
                            </span>
                        </p>
                    </div>
                    <Button size="lg" className="btn-primary">
                        Book Now
                    </Button>
                </div>
            </Card>
        </div>
    );
};