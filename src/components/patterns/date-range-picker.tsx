/* eslint-disable @typescript-eslint/no-unsafe-argument */
"use client";

import * as React from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { addDays, format } from "date-fns";
import type { DateRange } from "react-day-picker";

import { cn } from "~/lib/utils";

import { Calendar } from "~/components/ui/calendar";
import { Button, type ButtonProps } from "~/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { CalendarIcon, CircleX } from "lucide-react";

interface DateRangePickerProps
  extends React.ComponentPropsWithoutRef<typeof PopoverContent> {
  /**
   * The selected date range.
   * @default undefined
   * @type DateRange
   * @example { from: new Date(), to: new Date() }
   */
  dateRange?: DateRange;

  /**
   * The number of days to display in the date range picker.
   * @default undefined
   * @type number
   * @example 7
   */
  dayCount?: number;

  /**
   * The variant of the calendar trigger button.
   * @default "outline"
   * @type "default" | "outline" | "secondary" | "ghost"
   */
  triggerVariant?: Exclude<ButtonProps["variant"], "destructive" | "link">;

  /**
   * The size of the calendar trigger button.
   * @default "default"
   * @type "default" | "sm" | "lg"
   */
  triggerSize?: Exclude<ButtonProps["size"], "icon">;

  /**
   * The class name of the calendar trigger button.
   * @default undefined
   * @type string
   */
  triggerClassName?: string;
}

export function DateRangePicker({
  dateRange,
  dayCount,
  triggerVariant = "outline",
  triggerSize = "default",
  triggerClassName,
  className,
  ...props
}: DateRangePickerProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [date, setDate] = React.useState<DateRange | undefined>({
    from: undefined,
    to: undefined,
  });

  const handleRangeChange = (range: DateRange | undefined) => {
    setDate(range);
    const newSearchParams = new URLSearchParams(searchParams);
    if (range?.from) {
      newSearchParams.set("from", format(range.from, "yyyy-MM-dd"));
    } else {
      newSearchParams.delete("from");
    }

    if (range?.to) {
      newSearchParams.set("to", format(range.to, "yyyy-MM-dd"));
    } else {
      newSearchParams.delete("to");
    }

    router.push(`${pathname}?${newSearchParams.toString()}`);
  };

  return (
    <div className="grid gap-2">
      <Popover>
        <div className="flex items-center gap-2">
          <PopoverTrigger asChild>
            <Button
              variant={triggerVariant}
              size={triggerSize}
              className={cn(
                "w-full justify-start truncate text-left font-normal",
                triggerClassName,
              )}
            >
              <CalendarIcon className="mr-2 size-4" />
              {date?.from ? (
                date.to ? (
                  <>
                    {format(date.from, "LLL dd, y")} -{" "}
                    {format(date.to, "LLL dd, y")}
                  </>
                ) : (
                  format(date.from, "LLL dd, y")
                )
              ) : (
                <span>Pick a date</span>
              )}
            </Button>
          </PopoverTrigger>
          {date?.from && date?.to && (
            <CircleX
              onClick={() => {
                handleRangeChange(undefined);
              }}
              className="h-4 w-4 transition-all hover:cursor-pointer hover:text-muted-foreground"
            />
          )}
        </div>
        <PopoverContent className={cn("w-auto p-0", className)} {...props}>
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={handleRangeChange}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
