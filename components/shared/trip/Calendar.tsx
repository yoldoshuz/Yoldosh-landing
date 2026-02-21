"use client";

import * as React from "react";
import { useTranslations } from "next-intl";

import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

export const CalendarSelect = ({
  onDateChange,
}: {
  onDateChange?: React.Dispatch<React.SetStateAction<Date | undefined>>;
}) => {
  const t = useTranslations("Components");
  const currentDate = new Date().toLocaleDateString();

  const [open, setOpen] = React.useState(false);
  const [date, setDate] = React.useState<Date | undefined>(undefined);

  return (
    <div className="flex flex-col items-start justify-start w-full">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild className="bg-none hover:bg-transparent">
          <button
            id="date"
            className="w-48 flex justify-start font-medium text-sm gap-3 px-0 py-0.75 h-auto cursor-pointer text-muted-foreground bg-none hover:bg-transparent select-none"
          >
            {date ? date.toLocaleDateString() : currentDate}
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-auto overflow-hidden p-0" align="start">
          <Calendar
            mode="single"
            selected={date}
            captionLayout="dropdown"
            onSelect={(date) => {
              setDate(date);
              // notify parent if handler provided
              if (onDateChange) onDateChange(date);
              setOpen(false);
            }}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};
