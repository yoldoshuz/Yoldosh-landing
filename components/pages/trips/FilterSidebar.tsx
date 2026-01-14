"use client";
import { Cigarette, Dog, MessageCircle, Music, SlidersHorizontal, Trash, Wind, Armchair, Warehouse } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

interface FilterState {
  sort_by?: string;
  sort_order?: string;
  smoking_allowed?: boolean;
  pets_allowed?: boolean;
  music_allowed?: boolean;
  talkative?: boolean;
  conditioner?: boolean;
  max_two_back?: boolean; // Добавлено
  garage?: string;        // Добавлено (string для ENUM)
}

interface FilterSidebarProps {
  filters: FilterState;
  onChange: (newFilters: Partial<FilterState>) => void;
  className?: string;
}

export const FilterSidebar = ({ filters, onChange, className }: FilterSidebarProps) => {
  const t = useTranslations("Components.Search");

  const updateFilter = (key: keyof FilterState, value: any) => {
    onChange({ [key]: value });
  };

  const toggleBoolean = (key: keyof FilterState) => {
    const current = filters[key];
    updateFilter(key, current ? undefined : true);
  };

  const hasActiveFilters = Object.values(filters).some((v) => v !== undefined && v !== "default" && v !== "asc");

  return (
    <aside
      className={cn("w-full lg:w-72 shrink-0 space-y-6 bg-white p-6 rounded-2xl border h-fit sticky top-24", className)}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-lg flex items-center gap-2">
          {t("Filters")}
        </h3>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() =>
              onChange({
                sort_by: undefined,
                sort_order: "asc",
                smoking_allowed: undefined,
                pets_allowed: undefined,
                music_allowed: undefined,
                talkative: undefined,
                conditioner: undefined,
                max_two_back: undefined,
                garage: undefined
              })
            }
            className="h-8 px-2 text-red-500 hover:text-red-600 hover:bg-red-50 text-xs cursor-pointer"
          >
            <Trash />
          </Button>
        )}
      </div>

      <ScrollArea className="pr-2 h-[calc(100vh-200px)]">
        {/* Сортировка */}
        <div className="space-y-4">
          <h4 className="font-semibold text-xs text-muted-foreground uppercase tracking-wider">{t("SortBy")}</h4>
          <RadioGroup
            value={filters.sort_by || "default"}
            onValueChange={(val) => updateFilter("sort_by", val === "default" ? undefined : val)}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="default" id="s-def" className="text-emerald-500 " />
              <Label htmlFor="s-def" className="cursor-pointer font-normal text-sm">{t("Sort.Default")}</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="price" id="s-price" className="text-emerald-500" />
              <Label htmlFor="s-price" className="cursor-pointer font-normal text-sm">{t("Sort.Price")}</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="departure_date" id="s-date" className="text-emerald-500" />
              <Label htmlFor="s-date" className="cursor-pointer font-normal text-sm">{t("Sort.Date")}</Label>
            </div>
          </RadioGroup>

          {filters.sort_by && filters.sort_by !== "default" && (
            <div className="mt-2 mx-1.25">
              <Select
                value={filters.sort_order || "asc"}
                onValueChange={(val) => updateFilter("sort_order", val)}
              >
                <SelectTrigger className="text-sm border rounded-lg p-2 w-full bg-neutral-50 outline-none focus:ring-1 focus:ring-emerald-500">
                  <SelectValue placeholder={t("Order")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>{t("Order")}</SelectLabel>
                    <SelectItem value="asc">{t("Ascending")}</SelectItem>
                    <SelectItem value="desc">{t("Descending")}</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          )}
        </div>

        <Separator className="my-6" />

        {/* Комфорт и опции */}
        <div className="space-y-4">
          <h4 className="font-semibold text-xs text-muted-foreground uppercase tracking-wider">
            {t("DriverPreferences")}
          </h4>

          <div className="space-y-2">
            <FilterItem
              icon={<Wind className="size-4" />}
              label={t("Preferences.AC")}
              checked={filters.conditioner}
              onChange={() => toggleBoolean("conditioner")}
            />
            {/* <FilterItem
              icon={<Armchair className="size-4" />}
              label={t("Preferences.MaxTwoBack")} // "Макс 2 сзади"
              checked={filters.max_two_back}
              onChange={() => toggleBoolean("max_two_back")}
            /> */}
            <FilterItem
              icon={<Cigarette className="size-4" />}
              label={t("Preferences.Smoking")}
              checked={filters.smoking_allowed}
              onChange={() => toggleBoolean("smoking_allowed")}
            />
            <FilterItem
              icon={<Dog className="size-4" />}
              label={t("Preferences.Pets")}
              checked={filters.pets_allowed}
              onChange={() => toggleBoolean("pets_allowed")}
            />
            <FilterItem
              icon={<Music className="size-4" />}
              label={t("Preferences.Music")}
              checked={filters.music_allowed}
              onChange={() => toggleBoolean("music_allowed")}
            />
            <FilterItem
              icon={<MessageCircle className="size-4" />}
              label={t("Preferences.Talkative")}
              checked={filters.talkative}
              onChange={() => toggleBoolean("talkative")}
            />
          </div>

          <Separator className="my-4" />

          {/* Фильтр по Багажу (Garage Status) */}
          <h4 className="font-semibold text-xs text-muted-foreground uppercase tracking-wider">
            {t("PassengerPreferences")}
          </h4>
          <Select
            value={filters.garage || "ANY"}
            onValueChange={(val) => updateFilter("garage", val === "ANY" ? undefined : val)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder={t("Preferences.Any")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ANY">{t("Preferences.Any")}</SelectItem>
              <SelectItem value="EMPTY">{t("Preferences.Empty")}</SelectItem>
              <SelectItem value="HALF_EMPTY">{t("Preferences.HalfEmpty")}</SelectItem>
              <SelectItem value="FULL">{t("Preferences.Full")}</SelectItem>
            </SelectContent>
          </Select>

        </div>
      </ScrollArea>
    </aside>
  );
};

const FilterItem = ({ icon, label, checked, onChange }: any) => (
  <div
    className={cn(
      "flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-all hover:border-emerald-300",
      checked ? "bg-emerald-50 border-emerald-500 shadow-xs" : "bg-white border-transparent hover:bg-neutral-50"
    )}
    onClick={onChange}
  >
    <div className="flex items-center gap-3 text-sm font-medium">
      <span className={cn("text-neutral-400", checked && "text-emerald-600")}>{icon}</span>
      <span className={cn(checked && "text-emerald-900")}>{label}</span>
    </div>
    <Checkbox
      checked={!!checked}
      className={cn("data-[state=checked]:bg-emerald-500 data-[state=checked]:border-emerald-500")}
    />
  </div>
);