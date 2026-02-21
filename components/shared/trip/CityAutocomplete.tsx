"use client";

import { useEffect, useRef, useState } from "react";
import { MapPin } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface CityData {
  name: string;
  lat?: number;
  lng?: number;
}

interface CityAutocompleteProps {
  placeholder: string;
  initialValue?: string;
  onCitySelected: (data: CityData) => void;
  className?: string;
}

declare global {
  interface Window {
    google: any;
  }
}

export const CityAutocomplete = ({
  placeholder,
  initialValue,
  onCitySelected,
  className,
}: CityAutocompleteProps) => {
  const [value, setValue] = useState(initialValue || "");
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchSuggestions = async (input: string) => {
    if (!window.google || !input) return;

    const { AutocompleteSuggestion } =
      await window.google.maps.importLibrary("places");

    const response =
      await AutocompleteSuggestion.fetchAutocompleteSuggestions({
        input,
        includedRegionCodes: ["uz"], // ЖЁСТКО только Узбекистан
        includedPrimaryTypes: [
          "locality",                 // города
          "administrative_area_level_1", // области
          "route",                    // улицы
          "street_address",           // конкретные адреса
        ],
      });

    setSuggestions(response.suggestions || []);
  };

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setValue(val);
    setDropdownOpen(true);

    if (val === "") {
      setSuggestions([]);
      onCitySelected({ name: "" });
      return;
    }

    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(() => {
      fetchSuggestions(val);
    }, 300);
  };

  const handleSelect = async (suggestion: any) => {
    const placePrediction = suggestion.placePrediction;
    const description = placePrediction.text.text;

    setValue(description);
    setDropdownOpen(false);
    setSuggestions([]);

    try {
      const place = await placePrediction.toPlace();
      await place.fetchFields({
        fields: ["displayName", "location"],
      });

      const lat = place.location?.lat();
      const lng = place.location?.lng();
      const normalizedName = place.displayName;

      onCitySelected({
        name: normalizedName,
        lat,
        lng,
      });
    } catch (error) {
      console.error("Place fetch error:", error);
      onCitySelected({ name: description });
    }
  };

  return (
    <div className="relative w-full" ref={wrapperRef}>
      <Input
        value={value}
        onChange={handleInput}
        placeholder={placeholder}
        required
        autoComplete="off"
        className={cn(
          "border-none shadow-none rounded-none p-0 h-auto text-sm font-medium placeholder:text-muted-foreground focus-visible:ring-0",
          className
        )}
      />

      {isDropdownOpen && suggestions.length > 0 && (
        <ul className="absolute z-50 top-full left-0 w-full mt-2 bg-white border rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {suggestions.map((suggestion, index) => {
            const prediction = suggestion.placePrediction;

            return (
              <li
                key={index}
                onClick={() => handleSelect(suggestion)}
                className="px-4 py-3 hover:bg-neutral-50 cursor-pointer flex items-center gap-3 transition-colors text-sm"
              >
                <MapPin className="size-4 text-emerald-500 shrink-0" />
                <div className="flex flex-col">
                  <span className="font-medium text-neutral-900">
                    {prediction.text.text}
                  </span>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};