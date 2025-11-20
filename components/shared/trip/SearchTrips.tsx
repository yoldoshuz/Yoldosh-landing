"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { CalendarSelect } from "./Calendar";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { REGIONS } from "@/constants";

export const SearchTrips = () => {
    const t = useTranslations("Pages.Home");
    const router = useRouter();
    const [fromRegion, setFromRegion] = useState("");
    const [toRegion, setToRegion] = useState("");
    const [date, setDate] = useState<Date | undefined>();
    const [seats, setSeats] = useState("1");

    const handleSearch = () => {
        if (!fromRegion || !toRegion) {
            alert("Please select both departure and arrival locations");
            return;
        }

        const params = new URLSearchParams({
            from: fromRegion,
            to: toRegion,
            seats: seats,
        });

        if (date) {
            params.append("date", date.toISOString().split('T')[0]);
        }

        router.push(`/trips?${params.toString()}`);
    };

    return (
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between w-full gap-2 shadow-2xl border p-6 md:py-2 md:pl-8 md:pr-2 rounded-3xl md:rounded-full">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between w-full gap-4">
                <div className="flex items-center justify-start gap-2 w-full border-b md:border-b-0 md:border-r py-1">
                    <div className="flex items-center justify-center size-6 border-2 border-teal-500 rounded-full p-2">
                        <span className="bg-teal-500 rounded-full p-1" />
                    </div>
                    <Select value={fromRegion} onValueChange={setFromRegion}>
                        <SelectTrigger className="border-none shadow-none text-muted-foreground cursor-pointer">
                            <SelectValue placeholder={t("From")} />
                        </SelectTrigger>
                        <SelectContent>
                            {REGIONS().map((region) => (
                                <SelectItem key={region.id} value={region.id.toString()}>
                                    {region.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div className="flex items-center justify-start gap-2 w-full border-b md:border-b-0 md:border-r py-1">
                    <div className="flex items-center justify-center size-6 border-2 border-muted-foreground rounded-full p-2">
                        <span className="bg-muted-foreground rounded-full p-1" />
                    </div>
                    <Select value={toRegion} onValueChange={setToRegion}>
                        <SelectTrigger className="border-none shadow-none text-muted-foreground cursor-pointer">
                            <SelectValue placeholder={t("To")} />
                        </SelectTrigger>
                        <SelectContent>
                            {REGIONS().map((region) => (
                                <SelectItem key={region.id} value={region.id.toString()}>
                                    {region.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div className="flex items-center justify-center gap-2 w-full border-b md:border-b-0 md:border-r py-1">
                    <CalendarSelect onDateChange={setDate} />
                </div>
                <div className="flex items-center justify-center gap-2 w-full">
                    <Select value={seats} onValueChange={setSeats}>
                        <SelectTrigger className="bg-transparent border-none shadow-none cursor-pointer w-full px-0 select-none">
                            <SelectValue
                                placeholder={
                                    <div className="flex items-center gap-4">
                                        <UserRound className="size-6" />
                                        {t("Passengers.Title")}
                                    </div>
                                }
                            />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="1">{t("Passengers.1")}</SelectItem>
                            <SelectItem value="2">{t("Passengers.2")}</SelectItem>
                            <SelectItem value="3">{t("Passengers.3")}</SelectItem>
                            <SelectItem value="4">{t("Passengers.4")}</SelectItem>
                            <SelectItem value="5">{t("Passengers.5")}</SelectItem>
                            <SelectItem value="6">{t("Passengers.6")}</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="flex items-center justify-center gap-2 w-full h-full">
                    <Button
                        onClick={handleSearch}
                        className="btn-primary w-full py-6 md:py-10 rounded-2xl md:rounded-full text-xl select-none"
                    >
                        {t("Search")}
                    </Button>
                </div>
            </div>
        </div>
    );
};