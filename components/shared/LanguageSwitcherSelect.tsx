"use client"

import { useTransition } from "react";
import { Locale } from "@/app/i18n/config";
import { setUserLocale } from "@/app/i18n/locale";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";

interface LanguageSwitcherSelectProps {
    defaultValue: string;
    items: Array<{ value: string; label: string }>;
};

export const LanguageSwitcherSelect = ({ defaultValue, items }: LanguageSwitcherSelectProps) => {
    const [isPending, startTransition] = useTransition();

    const onChange = async (value: string) => {
        const locale = value as Locale;
        startTransition(async () => {
            localStorage.setItem("locale", locale);
            await setUserLocale(locale);
        });
    };

    return (
        <Select defaultValue={defaultValue} onValueChange={onChange}>
            <SelectTrigger
                className="h-8 w-auto"
                disabled={isPending}
            >
                <SelectValue />
            </SelectTrigger>
            <SelectContent className="w-auto z-20">
                <SelectGroup>
                    {items.map((item) => (
                        <SelectItem key={item.value} value={item.value}>
                            {item.label}
                        </SelectItem>
                    ))}
                </SelectGroup>
            </SelectContent>
        </Select>
    );
};