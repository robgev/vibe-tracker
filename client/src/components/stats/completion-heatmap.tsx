"use client";

import CalendarHeatmap from "react-calendar-heatmap";
import "react-calendar-heatmap/dist/styles.css";
import { format, subMonths } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface HeatmapValue {
  date: string;
  count: number;
}

interface CompletionHeatmapProps {
  completedDates: string[]; // Array of "YYYY-MM-DD" strings
  monthsToShow?: number;
}

export function CompletionHeatmap({
  completedDates,
  monthsToShow = 6,
}: CompletionHeatmapProps) {
  const endDate = new Date();
  const startDate = subMonths(endDate, monthsToShow);

  // Convert completed dates to heatmap values
  const values: HeatmapValue[] = completedDates.map((date) => ({
    date,
    count: 1,
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Activity Heatmap</CardTitle>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          Your completion history over the last {monthsToShow} months
        </p>
      </CardHeader>
      <CardContent>
        <div className="calendar-heatmap-container">
          <CalendarHeatmap
            startDate={startDate}
            endDate={endDate}
            values={values}
            classForValue={(value) => {
              if (!value) {
                return "color-empty";
              }
              return "color-filled";
            }}
            tooltipDataAttrs={(value: HeatmapValue | null) => {
              if (!value || !value.date) {
                return {
                  "data-tip": "No data",
                };
              }
              return {
                "data-tip": `${value.date} - Completed`,
              };
            }}
            showWeekdayLabels={true}
          />
        </div>

        {/* Legend */}
        <div className="flex items-center gap-2 mt-4 text-sm text-zinc-600 dark:text-zinc-400">
          <span>Less</span>
          <div className="flex gap-1">
            <div className="w-3 h-3 rounded-sm bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700" />
            <div className="w-3 h-3 rounded-sm bg-green-200 dark:bg-green-900" />
            <div className="w-3 h-3 rounded-sm bg-green-400 dark:bg-green-700" />
            <div className="w-3 h-3 rounded-sm bg-green-600 dark:bg-green-500" />
            <div className="w-3 h-3 rounded-sm bg-green-700 dark:bg-green-400" />
          </div>
          <span>More</span>
        </div>

        <style jsx global>{`
          .calendar-heatmap-container {
            font-family: inherit;
          }

          .react-calendar-heatmap text {
            font-size: 10px;
            fill: rgb(113 113 122);
          }

          @media (prefers-color-scheme: dark) {
            .react-calendar-heatmap text {
              fill: rgb(161 161 170);
            }
          }

          .react-calendar-heatmap .color-empty {
            fill: rgb(244 244 245);
          }

          @media (prefers-color-scheme: dark) {
            .react-calendar-heatmap .color-empty {
              fill: rgb(39 39 42);
            }
          }

          .react-calendar-heatmap .color-filled {
            fill: rgb(34 197 94);
          }

          @media (prefers-color-scheme: dark) {
            .react-calendar-heatmap .color-filled {
              fill: rgb(74 222 128);
            }
          }

          .react-calendar-heatmap rect {
            rx: 2;
          }

          .react-calendar-heatmap rect:hover {
            opacity: 0.8;
            stroke: rgb(24 24 27);
            stroke-width: 1;
          }

          @media (prefers-color-scheme: dark) {
            .react-calendar-heatmap rect:hover {
              stroke: rgb(250 250 250);
            }
          }
        `}</style>
      </CardContent>
    </Card>
  );
}
