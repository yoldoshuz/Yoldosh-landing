"use client";

import * as React from "react";
import { Calendar1 } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
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
          <Button
            variant="ghost"
            id="date"
            className="w-48 justify-start font-normal gap-4 px-0! cursor-pointer text-muted-foreground bg-none hover:bg-transparent select-none"
          >
            <Calendar1 className="size-6" />
            {date ? date.toLocaleDateString() : currentDate}
          </Button>
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
