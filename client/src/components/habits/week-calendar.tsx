"use client";

import { format, parseISO } from "date-fns";
import { CheckCircle2, Circle } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import type { WeekDay } from "@/lib/api/types";

interface WeekCalendarProps {
  weekDays: WeekDay[];
  onToggleDay: (date: string, isCompleted: boolean) => void;
  isPending?: boolean;
}

const WEEKDAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export function WeekCalendar({
  weekDays,
  onToggleDay,
  isPending = false,
}: WeekCalendarProps) {
  return (
    <div className="grid grid-cols-7 gap-2 md:gap-4">
      {weekDays.map((day, index) => {
        const date = parseISO(day.date);
        const dayOfMonth = format(date, "d");
        const isToday =
          format(new Date(), "yyyy-MM-dd") === format(date, "yyyy-MM-dd");

        return (
          <div
            key={day.date}
            className={cn(
              "flex flex-col items-center p-3 md:p-4 rounded-lg border-2 transition-all",
              day.completed
                ? "border-green-500 bg-green-50 dark:bg-green-950/30"
                : "border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900",
              isToday && "ring-2 ring-zinc-900 dark:ring-white",
              isPending && "opacity-50 cursor-not-allowed",
            )}
          >
            {/* Weekday Label */}
            <div
              className={cn(
                "text-xs font-medium mb-2",
                day.completed
                  ? "text-green-700 dark:text-green-300"
                  : "text-zinc-600 dark:text-zinc-400",
              )}
            >
              {WEEKDAY_LABELS[index]}
            </div>

            {/* Day of Month */}
            <div
              className={cn(
                "text-lg font-bold mb-2",
                day.completed
                  ? "text-green-900 dark:text-green-100"
                  : "text-zinc-900 dark:text-white",
              )}
            >
              {dayOfMonth}
            </div>

            {/* Completion Checkbox */}
            <button
              onClick={() => onToggleDay(day.date, day.completed)}
              disabled={isPending}
              className="flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-zinc-900 dark:focus:ring-white rounded"
              aria-label={`Mark ${WEEKDAY_LABELS[index]} as ${day.completed ? "incomplete" : "complete"}`}
            >
              {day.completed ? (
                <CheckCircle2 className="h-6 w-6 text-green-600 dark:text-green-400" />
              ) : (
                <Circle className="h-6 w-6 text-zinc-400 dark:text-zinc-600 hover:text-zinc-600 dark:hover:text-zinc-400 transition-colors" />
              )}
            </button>
          </div>
        );
      })}
    </div>
  );
}
