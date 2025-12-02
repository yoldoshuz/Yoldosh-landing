import { Trip } from "@/types/";
import { Card } from "@/components/ui/card";
import { useTranslations } from "next-intl";
import { Badge } from "@/components/ui/badge";
import {
    Avatar,
    AvatarFallback,
    AvatarImage
} from "@/components/ui/avatar";
import {
    Calendar,
    Users,
    Cigarette,
    Dog,
    Music,
    MessageCircle,
    Wind,
    Timer
} from "lucide-react";
import { Separator } from "@/components/ui/separator";

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
                className="p-5 hover:border-emerald-500 hover:shadow-xl smooth cursor-pointer shadow-none bg-white"
                onClick={onClick}
            >
                <div className="flex flex-col gap-4 md:gap-6">

                    {/* Driver & Price */}
                    <div className="flex items-center gap-4 ">
                        <div className="flex items-center gap-4 w-full">
                            <div className="relative">
                                <Avatar className="size-12 rounded-full bg-emerald-100 flex items-center justify-center">
                                    <AvatarImage src="" />
                                    <AvatarFallback className="bg-emerald-300 font-bold text-white text-xl">{trip.driver.firstName[0]}</AvatarFallback>
                                </Avatar>
                                <div className="absolute -bottom-2 -right-2 z-10 bg-emerald-500 border border-white rounded-full px-1.5 py-0.5 flex items-center gap-1 text-xs text-muted-foreground">
                                    <span className="text-white">{trip.driver.rating.toFixed(1)}</span>
                                </div>
                            </div>
                            <div className="flex flex-row items-center justify-between w-full">
                                <div className="flex flex-col justify-center">
                                    <p className="font-medium text-base">
                                        {trip.driver.firstName}
                                    </p>
                                    <p className="text-muted-foreground text-xs">
                                        {trip.car && <span>{trip.car.make} {trip.car.model}</span>}
                                    </p>
                                </div>
                                <div className="text-lg font-bold">
                                    {trip.price.amount.toLocaleString()}
                                    <span className="text-sm font-normal text-muted-foreground ml-1">
                                        UZS
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Route */}
                    <div className="flex flex-col gap-2 min-w-[200px]">
                        <div className="flex items-center gap-3">
                            <span className="size-3 rounded-full border-2 border-emerald-500" />
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
                        {/* Preferences */}
                        <div className="flex flex-wrap gap-1">
                            {preferences.smoking_allowed ? (
                                <Badge className="text-xs bg-emerald-500">
                                    <Cigarette className="size-3 mr-1" />
                                    {t("Preferences.Smoking")}
                                </Badge>
                            ) : (
                                <Badge className="text-xs bg-red-300 text-white">
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
                                <Badge className="text-xs bg-red-300 text-white">
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
                                <Badge className="text-xs bg-red-300 text-white">
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
                                <Badge className="text-xs bg-red-300 text-white">
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
                                <Badge className="text-xs bg-red-300 text-white">
                                    <Wind className="size-3 mr-1" />
                                    {t("Preferences.AC")}
                                </Badge>
                            )}
                        </div>

                        <div className="flex flex-col md:flex-row items-start gap-3 text-sm text-muted-foreground mt-2">
                            <div className="flex items-center gap-2">
                                <Calendar className="size-4" />
                                <span>{formattedDate}</span>
                            </div>
                            <Separator orientation="vertical" className="hidden md:flex" />
                            <div className="flex items-center gap-2">
                                <Timer className="size-4" />
                                <span>{formattedTime}</span>
                            </div>
                            <Separator orientation="vertical" className="hidden md:flex" />
                            <div className="flex items-center gap-2">
                                <Users className="size-4" />
                                <span>{trip.seats_available} {t("Details.Seats")}</span>
                            </div>

                        </div>
                    </div>
                </div>
            </Card>
        );
    }

    return (
        <Card
            className="p-5 hover:border-emerald-500 hover:shadow-xl smooth cursor-pointer shadow-none bg-white"
            onClick={onClick}
        >
            <div className="flex flex-col gap-4 md:gap-6">

                {/* Driver & Price */}
                <div className="flex items-center gap-4 ">
                    <div className="flex items-center gap-4 w-full">
                        <div className="relative">
                            <Avatar className="size-12 rounded-full bg-emerald-100 flex items-center justify-center">
                                <AvatarImage src="" />
                                <AvatarFallback className="bg-emerald-300 font-bold text-white text-xl">{trip.driver.firstName[0]}</AvatarFallback>
                            </Avatar>

                            {/* rating overlay above avatar */}
                            <div className="absolute -bottom-2 -right-2 z-10 bg-emerald-500 border border-white rounded-full px-1.5 py-0.5 flex items-center gap-1 text-xs text-muted-foreground">
                                <span className="text-white">{trip.driver.rating.toFixed(1)}</span>
                            </div>
                        </div>
                        <div className="flex flex-row items-center justify-between w-full">
                            <div className="flex flex-col justify-center">
                                <p className="font-medium text-base">
                                    {trip.driver.firstName}
                                </p>
                                <p className="text-muted-foreground text-xs">
                                    {trip.car && <span>{trip.car.make} {trip.car.model}</span>}
                                </p>
                            </div>
                            <div className="text-lg font-bold">
                                {trip.price.amount.toLocaleString()}
                                <span className="text-sm font-normal text-muted-foreground ml-1">
                                    UZS
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Route */}
                <div className="flex flex-col gap-2 min-w-[200px]">
                    <div className="flex items-center gap-3">
                        <span className="size-3 rounded-full border-2 border-emerald-500" />
                        <h3 className="font-semibold text-sm">
                            {trip.from_location.address}
                        </h3>
                    </div>
                    <div className="w-0.5 h-6 bg-neutral-300 ml-1" />
                    <div className="flex items-center gap-3">
                        <span className="size-3 rounded-full bg-muted-foreground" />
                        <h3 className="font-semibold text-sm">
                            {trip.from_location.address}
                        </h3>
                    </div>
                </div>

                {/* Info */}
                <div className="flex-1 flex flex-col justify-between gap-4">
                    {/* Preferences */}
                    <div className="flex flex-wrap gap-1">
                        {preferences.smoking_allowed ? (
                            <Badge className="text-xs bg-emerald-500">
                                <Cigarette className="size-3 mr-1" />
                                {t("Preferences.Smoking")}
                            </Badge>
                        ) : (
                            <Badge className="text-xs bg-red-300 text-white">
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
                            <Badge className="text-xs bg-red-300 text-white">
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
                            <Badge className="text-xs bg-red-300 text-white">
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
                            <Badge className="text-xs bg-red-300 text-white">
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
                            <Badge className="text-xs bg-red-300 text-white">
                                <Wind className="size-3 mr-1" />
                                {t("Preferences.AC")}
                            </Badge>
                        )}
                    </div>

                    <div className="flex flex-col items-start gap-3 text-sm text-muted-foreground mt-2">
                        <div className="flex items-center gap-2">
                            <Calendar className="size-4" />
                            <span>{formattedDate}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Timer className="size-4" />
                            <span>{formattedTime}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Users className="size-4" />
                            <span>{trip.seats_available} {t("Details.Seats")}</span>
                        </div>

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
                className="p-5 hover:border-emerald-500 hover:shadow-xl smooth cursor-pointer shadow-none bg-white"
                onClick={onClick}
            >
                <div className="flex flex-col gap-4 md:gap-6">

                    {/* Driver & Price */}
                    <div className="flex items-center gap-4 ">
                        <div className="flex items-center gap-4 w-full">
                            <div className="relative">
                                <Avatar className="size-12 rounded-full bg-emerald-100 flex items-center justify-center">
                                    <AvatarImage src="" />
                                    <AvatarFallback className="bg-emerald-300 font-bold text-white text-xl">{trip.driver.firstName[0]}</AvatarFallback>
                                </Avatar>

                                {/* rating overlay above avatar */}
                                <div className="absolute -bottom-2 -right-2 z-10 bg-emerald-500 border border-white rounded-full px-1.5 py-0.5 flex items-center gap-1 text-xs text-muted-foreground">
                                    <span className="text-white">{trip.driver.rating.toFixed(1)}</span>
                                </div>
                            </div>
                            <div className="flex flex-row items-center justify-between w-full">
                                <div className="flex flex-col justify-center">
                                    <p className="font-medium text-base">
                                        {trip.driver.firstName}
                                    </p>
                                    <p className="text-muted-foreground text-xs">
                                        {trip.car && <span>{trip.car.make} {trip.car.model}</span>}
                                    </p>
                                </div>
                                <div className="text-lg font-bold">
                                    {trip.price.amount.toLocaleString()}
                                    <span className="text-sm font-normal text-muted-foreground ml-1">
                                        UZS
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Route */}
                    <div className="flex flex-col gap-2 min-w-[200px]">
                        <div className="flex items-center gap-3">
                            <span className="size-3 rounded-full border-2 border-emerald-500" />
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
                        {/* Preferences */}
                        <div className="flex flex-wrap gap-1">
                            {preferences.smoking_allowed ? (
                                <Badge className="text-xs bg-emerald-500">
                                    <Cigarette className="size-3 mr-1" />
                                    {t("Preferences.Smoking")}
                                </Badge>
                            ) : (
                                <Badge className="text-xs bg-red-300 text-white">
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
                                <Badge className="text-xs bg-red-300 text-white">
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
                                <Badge className="text-xs bg-red-300 text-white">
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
                                <Badge className="text-xs bg-red-300 text-white">
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
                                <Badge className="text-xs bg-red-300 text-white">
                                    <Wind className="size-3 mr-1" />
                                    {t("Preferences.AC")}
                                </Badge>
                            )}
                        </div>

                        <div className="flex flex-col md:flex-row items-start gap-3 text-sm text-muted-foreground mt-2">
                            <div className="flex items-center gap-2">
                                <Calendar className="size-4" />
                                <span>{formattedDate}</span>
                            </div>
                            <Separator orientation="vertical" className="hidden md:flex" />
                            <div className="flex items-center gap-2">
                                <Timer className="size-4" />
                                <span>{formattedTime}</span>
                            </div>
                            <Separator orientation="vertical" className="hidden md:flex" />
                            <div className="flex items-center gap-2">
                                <Users className="size-4" />
                                <span>{trip.seats_available} {t("Details.Seats")}</span>
                            </div>

                        </div>
                    </div>
                </div>
            </Card>
        );
    };

    return (
        <Card
            className="p-5 hover:border-emerald-500 hover:shadow-xl smooth cursor-pointer shadow-none bg-white"
            onClick={onClick}
        >
            <div className="flex flex-col gap-4 md:gap-6">

                {/* Driver & Price */}
                <div className="flex items-center gap-4 ">
                    <div className="flex items-center gap-4 w-full">
                        <div className="relative">
                            <Avatar className="size-12 rounded-full bg-emerald-100 flex items-center justify-center">
                                <AvatarImage src="" />
                                <AvatarFallback className="bg-emerald-300 font-bold text-white text-xl">{trip.driver.firstName[0]}</AvatarFallback>
                            </Avatar>

                            {/* rating overlay above avatar */}
                            <div className="absolute -bottom-2 -right-2 z-10 bg-emerald-500 border border-white rounded-full px-1.5 py-0.5 flex items-center gap-1 text-xs text-muted-foreground">
                                <span className="text-white">{trip.driver.rating.toFixed(1)}</span>
                            </div>
                        </div>
                        <div className="flex flex-row items-center justify-between w-full">
                            <div className="flex flex-col justify-center">
                                <p className="font-medium text-base">
                                    {trip.driver.firstName}
                                </p>
                                <p className="text-muted-foreground text-xs">
                                    {trip.car && <span>{trip.car.make} {trip.car.model}</span>}
                                </p>
                            </div>
                            <div className="text-lg font-bold">
                                {trip.price.amount.toLocaleString()}
                                <span className="text-sm font-normal text-muted-foreground ml-1">
                                    UZS
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Route */}
                <div className="flex flex-col gap-2 min-w-[200px]">
                    <div className="flex items-center gap-3">
                        <span className="size-3 rounded-full border-2 border-emerald-500" />
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
                <div className="flex-1 flex flex-col justify-between gap-4">
                    {/* Preferences */}
                    <div className="flex flex-wrap gap-1">
                        {preferences.smoking_allowed ? (
                            <Badge className="text-xs bg-emerald-500">
                                <Cigarette className="size-3 mr-1" />
                                {t("Preferences.Smoking")}
                            </Badge>
                        ) : (
                            <Badge className="text-xs bg-red-300 text-white">
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
                            <Badge className="text-xs bg-red-300 text-white">
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
                            <Badge className="text-xs bg-red-300 text-white">
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
                            <Badge className="text-xs bg-red-300 text-white">
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
                            <Badge className="text-xs bg-red-300 text-white">
                                <Wind className="size-3 mr-1" />
                                {t("Preferences.AC")}
                            </Badge>
                        )}
                    </div>

                    <div className="flex flex-col items-start gap-3 text-sm text-muted-foreground mt-2">
                        <div className="flex items-center gap-2">
                            <Calendar className="size-4" />
                            <span>{formattedDate}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Timer className="size-4" />
                            <span>{formattedTime}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Users className="size-4" />
                            <span>{trip.seats_available} {t("Details.Seats")}</span>
                        </div>

                    </div>
                </div>
            </div>
        </Card>
    );
};