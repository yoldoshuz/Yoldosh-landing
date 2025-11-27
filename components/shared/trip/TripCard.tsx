import { Trip } from "@/types/";
import { Card } from "@/components/ui/card";
import { useTranslations } from "next-intl";
import { Calendar, Users, Star, Car, Cigarette, Dog, Music, MessageCircle, Wind } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface TripCardProps {
    trip: Trip;
    onClick: () => void;
    viewMode?: "grid" | "list";
}

export const TripCard = ({ trip, onClick, viewMode = "grid" }: TripCardProps) => {
    const t = useTranslations("Pages.Trips");

    const departureDate = new Date(trip.departure_ts);
    const locale = localStorage.getItem("locale") === "uz" ? "uz-UZ" : localStorage.getItem("locale") === "ru" ? "ru-RU" : "en-US";

    const formattedDate = departureDate.toLocaleDateString(locale, {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });
    const formattedTime = departureDate.toLocaleTimeString(locale, {
        hour: "2-digit",
        minute: "2-digit",
    });

    const preferences = trip.driver.preferences || {};

    if (viewMode === "list") {
        return (
            <Card
                className="p-5 hover:border-green-500 hover:shadow-xl smooth cursor-pointer shadow-none bg-white"
                onClick={onClick}
            >
                <div className="flex flex-col md:flex-row gap-4 md:gap-6">
                    {/* Route */}
                    <div className="flex flex-col gap-2 min-w-[200px]">
                        <div className="flex items-center gap-3">
                            <span className="size-3 rounded-full border-2 border-green-500" />
                            <h3 className="font-semibold text-sm">
                                {trip.from_location.address}
                            </h3>
                        </div>
                        <div className="w-0.5 h-6 bg-neutral-300 ml-1" />
                        <div className="flex items-center gap-3">
                            <span className="size-3 rounded-full bg-muted-foreground" />
                            <h3 className="font-semibold text-sm">
                                {trip.to_location.address}
                            </h3>
                        </div>
                    </div>

                    {/* Info */}
                    <div className="flex-1 flex flex-col md:flex-row justify-between gap-4">
                        <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                                <Calendar className="size-4" />
                                <span>{formattedDate} {formattedTime}</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <Users className="size-4" />
                                <span>{trip.seats_available}</span>
                            </div>
                            {trip.car && (
                                <div className="flex items-center gap-1">
                                    <Car className="size-4" />
                                    <span>{trip.car.make} {trip.car.model}</span>
                                </div>
                            )}
                        </div>

                        {/* Preferences */}
                        <div className="flex flex-wrap gap-1">
                            {preferences.smoking_allowed && (
                                <Badge variant="secondary" className="text-xs">
                                    <Cigarette className="size-3 mr-1" />
                                    Smoking
                                </Badge>
                            )}
                            {preferences.pets_allowed && (
                                <Badge variant="secondary" className="text-xs">
                                    <Dog className="size-3 mr-1" />
                                    Pets
                                </Badge>
                            )}
                            {preferences.music_allowed && (
                                <Badge variant="secondary" className="text-xs">
                                    <Music className="size-3 mr-1" />
                                    Music
                                </Badge>
                            )}
                            {preferences.talkative && (
                                <Badge variant="secondary" className="text-xs">
                                    <MessageCircle className="size-3 mr-1" />
                                    Talkative
                                </Badge>
                            )}
                            {preferences.conditioner && (
                                <Badge variant="secondary" className="text-xs">
                                    <Wind className="size-3 mr-1" />
                                    AC
                                </Badge>
                            )}
                        </div>

                        {/* Driver & Price */}
                        <div className="flex items-center gap-4 pt-3 md:pt-0 border-t md:border-t-0 md:border-l md:pl-4">
                            <div className="flex items-center gap-2">
                                <div className="size-10 rounded-full bg-green-100 flex items-center justify-center">
                                    <span className="text-green-600 font-semibold">
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
                                <p className="text-xs text-muted-foreground">{t("From")}</p>
                                <p className="text-lg font-bold">
                                    {trip.price.amount.toLocaleString()}
                                    <span className="text-sm font-normal text-muted-foreground ml-1">
                                        UZS
                                    </span>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </Card>
        );
    }

    return (
        <Card
            className="p-5 hover:border-green-500 hover:shadow-xl smooth cursor-pointer shadow-none bg-white"
            onClick={onClick}
        >
            <div className="flex flex-col gap-4">
                {/* Route */}
                <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-3">
                        <span className="size-3 rounded-full border-2 border-green-500" />
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

                {/* Preferences */}
                <div className="flex flex-wrap gap-1">
                    {preferences.smoking_allowed && (
                        <Badge variant="secondary" className="text-xs">
                            <Cigarette className="size-3 mr-1" />
                            Smoking
                        </Badge>
                    )}
                    {preferences.pets_allowed && (
                        <Badge variant="secondary" className="text-xs">
                            <Dog className="size-3 mr-1" />
                            Pets
                        </Badge>
                    )}
                    {preferences.music_allowed && (
                        <Badge variant="secondary" className="text-xs">
                            <Music className="size-3 mr-1" />
                            Music
                        </Badge>
                    )}
                    {preferences.talkative && (
                        <Badge variant="secondary" className="text-xs">
                            <MessageCircle className="size-3 mr-1" />
                            Talkative
                        </Badge>
                    )}
                    {preferences.conditioner && (
                        <Badge variant="secondary" className="text-xs">
                            <Wind className="size-3 mr-1" />
                            AC
                        </Badge>
                    )}
                </div>

                <div className="flex items-center justify-between pt-3 border-t">
                    <div className="flex items-center gap-2">
                        <div className="size-10 rounded-full bg-green-100 flex items-center justify-center">
                            <span className="text-green-600 font-semibold">
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
                        <p className="text-xs text-muted-foreground">{t("From")}</p>
                        <p className="text-lg sm:text-xl font-bold">
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

export const PopularTripCard = ({ trip, onClick, viewMode = "grid" }: any) => {
    const t = useTranslations("Pages.Trips");

    const departureDate = new Date(trip.departure_ts);
    const locale = localStorage.getItem("locale") === "uz" ? "uz-UZ" : localStorage.getItem("locale") === "ru" ? "ru-RU" : "en-US";

    const formattedDate = departureDate.toLocaleDateString(locale, {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });
    const formattedTime = departureDate.toLocaleTimeString(locale, {
        hour: "2-digit",
        minute: "2-digit",
    });

    const preferences = trip.driver.preferences || {};

    if (viewMode === "list") {
        return (
            <Card
                className="p-5 hover:border-green-500 hover:shadow-xl smooth cursor-pointer shadow-none bg-white"
                onClick={onClick}
            >
                <div className="flex flex-col md:flex-row gap-4 md:gap-6">
                    {/* Route */}
                    <div className="flex flex-col gap-2 min-w-[200px]">
                        <div className="flex items-center gap-3">
                            <span className="size-3 rounded-full border-2 border-green-500" />
                            <h3 className="font-semibold text-sm">
                                {trip.from}
                            </h3>
                        </div>
                        <div className="w-0.5 h-6 bg-neutral-300 ml-1" />
                        <div className="flex items-center gap-3">
                            <span className="size-3 rounded-full bg-muted-foreground" />
                            <h3 className="font-semibold text-sm">
                                {trip.to}
                            </h3>
                        </div>
                    </div>

                    {/* Info */}
                    <div className="flex-1 flex flex-col md:flex-row justify-between gap-4">
                        <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                                <Calendar className="size-4" />
                                <span>{formattedDate} {formattedTime}</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <Users className="size-4" />
                                <span>{trip.seats_available}</span>
                            </div>
                            {trip.car && (
                                <div className="flex items-center gap-1">
                                    <Car className="size-4" />
                                    <span>{trip.car.make} {trip.car.model}</span>
                                </div>
                            )}
                        </div>

                        {/* Preferences */}
                        <div className="flex flex-wrap gap-1">
                            {preferences.smoking_allowed ? (
                                <Badge className="text-xs bg-green-500">
                                    <Cigarette className="size-3 mr-1" />
                                    {t("Preferences.Smoking")}
                                </Badge>
                            ) : (
                                <Badge variant="destructive" className="text-xs">
                                    <Cigarette className="size-3 mr-1" />
                                    {t("Preferences.Smoking")}
                                </Badge>
                            )}
                            {preferences.pets_allowed ? (
                                <Badge variant="secondary" className="text-xs">
                                    <Dog className="size-3 mr-1" />
                                    {t("Preferences.Pets")}
                                </Badge>
                            ) : (
                                <Badge variant="secondary" className="text-xs">
                                    <Dog className="size-3 mr-1" />
                                    {t("Preferences.Pets")}
                                </Badge>
                            )}
                            {preferences.music_allowed ? (
                                <Badge variant="secondary" className="text-xs">
                                    <Music className="size-3 mr-1" />
                                    {t("Preferences.Music")}
                                </Badge>
                            ) : (
                                <Badge variant="secondary" className="text-xs">
                                    <Music className="size-3 mr-1" />
                                    {t("Preferences.Music")}
                                </Badge>
                            )}
                            {preferences.talkative ? (
                                <Badge variant="secondary" className="text-xs">
                                    <MessageCircle className="size-3 mr-1" />
                                    {t("Preferences.Talkative")}
                                </Badge>
                            ) : (
                                <Badge variant="secondary" className="text-xs">
                                    <MessageCircle className="size-3 mr-1" />
                                    {t("Preferences.Talkative")}
                                </Badge>
                            )}
                            {preferences.conditioner ? (
                                <Badge variant="secondary" className="text-xs">
                                    <Wind className="size-3 mr-1" />
                                    {t("Preferences.AC")}
                                </Badge>
                            ) : (
                                <Badge variant="secondary" className="text-xs">
                                    <Wind className="size-3 mr-1" />
                                    {t("Preferences.AC")}
                                </Badge>
                            )}
                        </div>

                        {/* Driver & Price */}
                        <div className="flex items-center gap-4 pt-3 md:pt-0 border-t md:border-t-0 md:border-l md:pl-4">
                            <div className="flex items-center gap-2">
                                <div className="size-10 rounded-full bg-green-100 flex items-center justify-center">
                                    <span className="text-green-600 font-semibold">
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
                                <p className="text-xs text-muted-foreground">{t("From")}</p>
                                <p className="text-lg font-bold">
                                    {trip.price.amount.toLocaleString()}
                                    <span className="text-sm font-normal text-muted-foreground ml-1">
                                        UZS
                                    </span>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </Card>
        );
    }

    return (
        <Card
            className="p-5 hover:border-green-500 hover:shadow-xl smooth cursor-pointer shadow-none bg-white"
            onClick={onClick}
        >
            <div className="flex flex-col gap-4">
                {/* Route */}
                <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-3">
                        <span className="size-3 rounded-full border-2 border-green-500" />
                        <h3 className="font-semibold">
                            {trip.from}
                        </h3>
                    </div>
                    <div className="w-0.5 h-6 bg-neutral-300 ml-1" />
                    <div className="flex items-center gap-3">
                        <span className="size-3 rounded-full bg-muted-foreground" />
                        <h3 className="font-semibold">
                            {trip.to}
                        </h3>
                    </div>
                </div>

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

                {/* Preferences */}
                <div className="flex flex-wrap gap-1">
                    {preferences.smoking_allowed && (
                        <Badge variant="secondary" className="text-xs">
                            <Cigarette className="size-3 mr-1" />
                            Smoking
                        </Badge>
                    )}
                    {preferences.pets_allowed && (
                        <Badge variant="secondary" className="text-xs">
                            <Dog className="size-3 mr-1" />
                            Pets
                        </Badge>
                    )}
                    {preferences.music_allowed && (
                        <Badge variant="secondary" className="text-xs">
                            <Music className="size-3 mr-1" />
                            Music
                        </Badge>
                    )}
                    {preferences.talkative && (
                        <Badge variant="secondary" className="text-xs">
                            <MessageCircle className="size-3 mr-1" />
                            Talkative
                        </Badge>
                    )}
                    {preferences.conditioner && (
                        <Badge variant="secondary" className="text-xs">
                            <Wind className="size-3 mr-1" />
                            AC
                        </Badge>
                    )}
                </div>

                <div className="flex items-center justify-between pt-3 border-t">
                    <div className="flex items-center gap-2">
                        <div className="size-10 rounded-full bg-green-100 flex items-center justify-center">
                            <span className="text-green-600 font-semibold">
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
                        <p className="text-xs text-muted-foreground">{t("From")}</p>
                        <p className="text-lg sm:text-xl font-bold">
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