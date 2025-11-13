"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

import { REGIONS } from "@/constants";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
    Calendar as CalendarIcon,
    Search,
    Users
} from "lucide-react";
import {
    Popover,
    PopoverContent,
    PopoverTrigger
} from "@/components/ui/popover";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";

interface SearchFiltersProps {
    onSearch: (filters: any) => void;
    initialFilters?: any;
};

export const SearchFilters = ({ onSearch, initialFilters }: SearchFiltersProps) => {
    const t = useTranslations("Components.Search");
    const [fromRegion, setFromRegion] = useState(initialFilters?.from_region_id?.toString() || "");
    const [toRegion, setToRegion] = useState(initialFilters?.to_region_id?.toString() || "");
    const [date, setDate] = useState<Date | undefined>(
        initialFilters?.departure_date ? new Date(initialFilters.departure_date) : undefined
    );
    const [seats, setSeats] = useState(initialFilters?.seats?.toString() || "1");
    const router = useRouter();

    const handleSearch = () => {
        onSearch({
            from_region_id: parseInt(fromRegion),
            to_region_id: parseInt(toRegion),
            departure_date: date?.toISOString().split('T')[0],
            seats: parseInt(seats),
        });

        const params = new URLSearchParams({
            from: fromRegion,
            to: toRegion,
            seats: seats,
        });

        if (date) {
            params.append("date", date.toISOString().split('T')[0]);
        }

        router.push(`/trips/search?${params.toString()}`);
    };

    return (
        <Card className="p-6 shadow-2xl">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                <div>
                    <label className="text-sm font-medium mb-2 block">{t("From")}</label>
                    <Select value={fromRegion} onValueChange={setFromRegion}>
                        <SelectTrigger className="w-full cursor-pointer">
                            <SelectValue placeholder="Select region" />
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
                <div>
                    <label className="text-sm font-medium mb-2 block">{t("To")}</label>
                    <Select value={toRegion} onValueChange={setToRegion}>
                        <SelectTrigger className="w-full cursor-pointer">
                            <SelectValue placeholder="Select region" />
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
                <div>
                    <label className="text-sm font-medium mb-2 block">{t("Date")}</label>
                    <Popover>
                        <PopoverTrigger asChild className="w-full cursor-pointer">
                            <Button variant="outline" className="w-full justify-start">
                                <CalendarIcon className="mr-2 size-4" />
                                {date ? date.toLocaleDateString() : t("PickDate")}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                            <Calendar
                                mode="single"
                                selected={date}
                                onSelect={setDate}
                                disabled={(date) => date < new Date()}
                            />
                        </PopoverContent>
                    </Popover>
                </div>
                <div>
                    <label className="text-sm font-medium mb-2 block">{t("Passengers.Title")}</label>
                    <Select value={seats} onValueChange={setSeats}>
                        <SelectTrigger className="w-full cursor-pointer">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            {[1, 2, 3, 4, 5, 6].map((num) => (
                                <SelectItem key={num} value={num.toString()}>
                                    <div className="flex items-center gap-2">
                                        <Users className="size-4" />
                                        {num}
                                    </div>
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div className="flex items-end">
                    <Button
                        onClick={handleSearch}
                        className="w-full btn-primary"
                        disabled={!fromRegion || !toRegion}
                    >
                        <Search />
                        {t("Search")}
                    </Button>
                </div>
            </div>
        </Card>
    );
};