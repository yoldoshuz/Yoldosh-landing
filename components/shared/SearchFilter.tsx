"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarIcon, Users } from "lucide-react";

interface SearchFiltersProps {
    onSearch: (filters: any) => void;
    initialFilters?: any;
}

// Простой список регионов (можно заменить на API)
const REGIONS = [
    { id: 1, name: "Andijan" },
    { id: 3, name: "Bukhara" },
    { id: 6, name: "Fergana" },
    { id: 7, name: "Jizzakh" },
    { id: 9, name: "Namangan" },
    { id: 10, name: "Navoiy" },
    { id: 12, name: "Samarkand" },
    { id: 13, name: "Tashkent" },
    { id: 8, name: "Xorezm" },
    { id: 14, name: "Karakalpakstan" },
];

export const SearchFilters = ({ onSearch, initialFilters }: SearchFiltersProps) => {
    const [fromRegion, setFromRegion] = useState(initialFilters?.from_region_id?.toString() || "");
    const [toRegion, setToRegion] = useState(initialFilters?.to_region_id?.toString() || "");
    const [date, setDate] = useState<Date | undefined>(
        initialFilters?.departure_date ? new Date(initialFilters.departure_date) : undefined
    );
    const [seats, setSeats] = useState(initialFilters?.seats?.toString() || "1");

    const handleSearch = () => {
        onSearch({
            from_region_id: parseInt(fromRegion),
            to_region_id: parseInt(toRegion),
            departure_date: date?.toISOString().split('T')[0],
            seats: parseInt(seats),
        });
    };

    return (
        <Card className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                {/* From */}
                <div>
                    <label className="text-sm font-medium mb-2 block">From</label>
                    <Select value={fromRegion} onValueChange={setFromRegion}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select region" />
                        </SelectTrigger>
                        <SelectContent>
                            {REGIONS.map((region) => (
                                <SelectItem key={region.id} value={region.id.toString()}>
                                    {region.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* To */}
                <div>
                    <label className="text-sm font-medium mb-2 block">To</label>
                    <Select value={toRegion} onValueChange={setToRegion}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select region" />
                        </SelectTrigger>
                        <SelectContent>
                            {REGIONS.map((region) => (
                                <SelectItem key={region.id} value={region.id.toString()}>
                                    {region.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* Date */}
                <div>
                    <label className="text-sm font-medium mb-2 block">Date</label>
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button variant="outline" className="w-full justify-start">
                                <CalendarIcon className="mr-2 size-4" />
                                {date ? date.toLocaleDateString() : "Pick a date"}
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

                {/* Seats */}
                <div>
                    <label className="text-sm font-medium mb-2 block">Passengers</label>
                    <Select value={seats} onValueChange={setSeats}>
                        <SelectTrigger>
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

                {/* Search Button */}
                <div className="flex items-end">
                    <Button
                        onClick={handleSearch}
                        className="w-full btn-primary"
                        disabled={!fromRegion || !toRegion}
                    >
                        Search
                    </Button>
                </div>
            </div>
        </Card>
    );
};