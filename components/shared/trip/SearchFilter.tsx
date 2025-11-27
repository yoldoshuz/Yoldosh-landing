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
    Users,
    SlidersHorizontal
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
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";

interface SearchFiltersProps {
    onSearch: (filters: any) => void;
    initialFilters?: any;
}

export const SearchFilters = ({ onSearch, initialFilters }: SearchFiltersProps) => {
    const t = useTranslations("Components.Search");
    const [fromRegion, setFromRegion] = useState(initialFilters?.from_region_id?.toString() || "");
    const [toRegion, setToRegion] = useState(initialFilters?.to_region_id?.toString() || "");
    const [date, setDate] = useState<Date | undefined>(
        initialFilters?.departure_date ? new Date(initialFilters.departure_date) : undefined
    );
    const [seats, setSeats] = useState(initialFilters?.seats?.toString() || "1");

    // Сортировка
    const [sortBy, setSortBy] = useState<string>(initialFilters?.sort_by || "default");
    const [sortOrder, setSortOrder] = useState<string>(initialFilters?.sort_order || "asc");

    // Фильтры характеристик
    const [smokingAllowed, setSmokingAllowed] = useState<boolean | undefined>(initialFilters?.smoking_allowed);
    const [petsAllowed, setPetsAllowed] = useState<boolean | undefined>(initialFilters?.pets_allowed);
    const [musicAllowed, setMusicAllowed] = useState<boolean | undefined>(initialFilters?.music_allowed);
    const [talkative, setTalkative] = useState<boolean | undefined>(initialFilters?.talkative);
    const [conditioner, setConditioner] = useState<boolean | undefined>(initialFilters?.conditioner);

    const router = useRouter();

    const handleSearch = () => {
        const filters: any = {
            from_region_id: parseInt(fromRegion),
            to_region_id: parseInt(toRegion),
            departure_date: date?.toISOString().split('T')[0],
            seats: parseInt(seats),
        };

        // Добавляем сортировку
        if (sortBy !== "default") {
            filters.sort_by = sortBy;
            filters.sort_order = sortOrder;
        }

        // Добавляем фильтры характеристик
        if (smokingAllowed !== undefined) filters.smoking_allowed = smokingAllowed;
        if (petsAllowed !== undefined) filters.pets_allowed = petsAllowed;
        if (musicAllowed !== undefined) filters.music_allowed = musicAllowed;
        if (talkative !== undefined) filters.talkative = talkative;
        if (conditioner !== undefined) filters.conditioner = conditioner;

        onSearch(filters);

        const params = new URLSearchParams({
            from: fromRegion,
            to: toRegion,
            seats: seats,
        });

        if (date) {
            params.append("date", date.toISOString().split('T')[0]);
        }

        if (sortBy !== "default") {
            params.append("sort_by", sortBy);
            params.append("sort_order", sortOrder);
        }

        if (smokingAllowed !== undefined) params.append("smoking_allowed", String(smokingAllowed));
        if (petsAllowed !== undefined) params.append("pets_allowed", String(petsAllowed));
        if (musicAllowed !== undefined) params.append("music_allowed", String(musicAllowed));
        if (talkative !== undefined) params.append("talkative", String(talkative));
        if (conditioner !== undefined) params.append("conditioner", String(conditioner));

        router.push(`/trips?${params.toString()}`);
    };

    const resetFilters = () => {
        setSortBy("default");
        setSortOrder("asc");
        setSmokingAllowed(undefined);
        setPetsAllowed(undefined);
        setMusicAllowed(undefined);
        setTalkative(undefined);
        setConditioner(undefined);
    };

    return (
        <Card className="p-6 shadow-2xl">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
                <div>
                    <label className="text-sm font-medium mb-2 block">{t("From")}</label>
                    <Select value={fromRegion} onValueChange={setFromRegion}>
                        <SelectTrigger className="w-full cursor-pointer">
                            <SelectValue placeholder={t("SelectRegion")} />
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
                            <SelectValue placeholder={t("SelectRegion")} />
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

                {/* Dropdown для сортировки и фильтров */}
                <div className="flex items-end">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" className="w-full">
                                <SlidersHorizontal className="mr-2 size-4" />
                                {t("FiltersAndSort")}
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-80 max-h-[600px] overflow-y-auto">
                            <DropdownMenuLabel>{t("SortBy")}</DropdownMenuLabel>
                            <div className="p-4">
                                <RadioGroup value={sortBy} onValueChange={setSortBy}>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="default" id="sort-default" />
                                        <Label htmlFor="sort-default">{t("Sort.Default")}</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="price" id="sort-price" />
                                        <Label htmlFor="sort-price">{t("Sort.Price")}</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="departure_date" id="sort-date" />
                                        <Label htmlFor="sort-date">{t("Sort.Date")}</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="distance" id="sort-distance" />
                                        <Label htmlFor="sort-distance">{t("Sort.Distance")}</Label>
                                    </div>
                                </RadioGroup>

                                {sortBy !== "default" && (
                                    <div className="mt-3">
                                        <Label className="text-sm">{t("Order")}</Label>
                                        <Select value={sortOrder} onValueChange={setSortOrder}>
                                            <SelectTrigger className="w-full mt-2">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="asc">{t("Ascending")}</SelectItem>
                                                <SelectItem value="desc">{t("Descending")}</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                )}
                            </div>

                            <DropdownMenuSeparator />

                            <DropdownMenuLabel>{t("DriverPreferences")}</DropdownMenuLabel>
                            <div className="p-4 space-y-3">
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="smoking" className="text-sm">
                                        {t("Preferences.Smoking")}
                                    </Label>
                                    <Select
                                        value={smokingAllowed === undefined ? "any" : String(smokingAllowed)}
                                        onValueChange={(val) => setSmokingAllowed(val === "any" ? undefined : val === "true")}
                                    >
                                        <SelectTrigger className="w-32">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="any">{t("Any")}</SelectItem>
                                            <SelectItem value="true">{t("Yes")}</SelectItem>
                                            <SelectItem value="false">{t("No")}</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="flex items-center justify-between">
                                    <Label htmlFor="pets" className="text-sm">
                                        {t("Preferences.Pets")}
                                    </Label>
                                    <Select
                                        value={petsAllowed === undefined ? "any" : String(petsAllowed)}
                                        onValueChange={(val) => setPetsAllowed(val === "any" ? undefined : val === "true")}
                                    >
                                        <SelectTrigger className="w-32">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="any">{t("Any")}</SelectItem>
                                            <SelectItem value="true">{t("Yes")}</SelectItem>
                                            <SelectItem value="false">{t("No")}</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="flex items-center justify-between">
                                    <Label htmlFor="music" className="text-sm">
                                        {t("Preferences.Music")}
                                    </Label>
                                    <Select
                                        value={musicAllowed === undefined ? "any" : String(musicAllowed)}
                                        onValueChange={(val) => setMusicAllowed(val === "any" ? undefined : val === "true")}
                                    >
                                        <SelectTrigger className="w-32">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="any">{t("Any")}</SelectItem>
                                            <SelectItem value="true">{t("Yes")}</SelectItem>
                                            <SelectItem value="false">{t("No")}</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="flex items-center justify-between">
                                    <Label htmlFor="talkative" className="text-sm">
                                        {t("Preferences.Talkative")}
                                    </Label>
                                    <Select
                                        value={talkative === undefined ? "any" : String(talkative)}
                                        onValueChange={(val) => setTalkative(val === "any" ? undefined : val === "true")}
                                    >
                                        <SelectTrigger className="w-32">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="any">{t("Any")}</SelectItem>
                                            <SelectItem value="true">{t("Yes")}</SelectItem>
                                            <SelectItem value="false">{t("No")}</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="flex items-center justify-between">
                                    <Label htmlFor="conditioner" className="text-sm">
                                        {t("Preferences.AC")}
                                    </Label>
                                    <Select
                                        value={conditioner === undefined ? "any" : String(conditioner)}
                                        onValueChange={(val) => setConditioner(val === "any" ? undefined : val === "true")}
                                    >
                                        <SelectTrigger className="w-32">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="any">{t("Any")}</SelectItem>
                                            <SelectItem value="true">{t("Yes")}</SelectItem>
                                            <SelectItem value="false">{t("No")}</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <DropdownMenuSeparator />

                            <div className="p-2">
                                <Button
                                    variant="ghost"
                                    className="w-full"
                                    onClick={resetFilters}
                                >
                                    {t("ResetFilters")}
                                </Button>
                            </div>
                        </DropdownMenuContent>
                    </DropdownMenu>
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