"use client";

import { useEffect, useRef, useState } from "react";
import { MapPin } from "lucide-react";
import usePlacesAutocomplete, { getGeocode, getLatLng } from "use-places-autocomplete";

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

export const CityAutocomplete = ({ placeholder, initialValue, onCitySelected, className }: CityAutocompleteProps) => {
  const {
    ready,
    value,
    suggestions: { status, data },
    setValue,
    clearSuggestions,
  } = usePlacesAutocomplete({
    requestOptions: {
      types: ["(cities)"],
      componentRestrictions: { country: "uz" },
    },
    debounce: 300,
    defaultValue: initialValue || "",
  });

  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = async (description: string) => {
    setValue(description, false);
    clearSuggestions();
    setDropdownOpen(false);

    try {
      const results = await getGeocode({ address: description });

      if (results && results[0]) {
        const { lat, lng } = getLatLng(results[0]);

        const addressComponents = results[0].address_components;
        const cityComponent = addressComponents.find(
          (component: any) =>
            component.types.includes("locality") || component.types.includes("administrative_area_level_1")
        );

        const normalizedName = cityComponent ? cityComponent.long_name : description.split(",")[0];

        onCitySelected({
          name: normalizedName,
          lat: lat,
          lng: lng,
        });
      }
    } catch (error) {
      console.error("Geocoding error: ", error);
      onCitySelected({ name: description, lat: undefined, lng: undefined });
    }
  };

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
    setDropdownOpen(true);
    if (e.target.value === "") {
      onCitySelected({ name: "" });
    }
  };

  return (
    <div className="relative w-full" ref={wrapperRef}>
      <Input
        value={value}
        onChange={handleInput}
        disabled={!ready}
        placeholder={placeholder}
        required={true}
        className={cn(
          "border-none shadow-none rounded-none p-0 h-auto text-base font-medium placeholder:text-muted-foreground focus-visible:ring-0",
          className
        )}
        autoComplete="off"
      />

      {status === "OK" && isDropdownOpen && (
        <ul className="absolute z-50 top-full left-0 w-full mt-2 bg-white border rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {data.map(({ place_id, description, structured_formatting }) => (
            <li
              key={place_id}
              onClick={() => handleSelect(description)}
              className="px-4 py-3 hover:bg-neutral-50 cursor-pointer flex items-center gap-3 transition-colors text-sm"
            >
              <MapPin className="size-4 text-emerald-500 shrink-0" />
              <div className="flex flex-col">
                <span className="font-medium text-neutral-900">{structured_formatting.main_text}</span>
                <span className="text-xs text-neutral-500">{structured_formatting.secondary_text}</span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
