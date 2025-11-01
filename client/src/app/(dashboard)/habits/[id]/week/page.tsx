"use client";

import { ArrowLeft, BarChart3 } from "lucide-react";
import Link from "next/link";
import { use } from "react";
import { WeekCalendar } from "@/components/habits/week-calendar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useHabit,
  useToggleCompletion,
  useWeekView,
} from "@/lib/hooks/use-habits";
import { calculateStreakFromWeek } from "@/lib/utils/streak-calculator";

interface WeekViewPageProps {
  params: Promise<{ id: string }>;
}

export default function WeekViewPage({ params }: WeekViewPageProps) {
  const { id } = use(params);
  const { data: habitData, isLoading: habitLoading } = useHabit(id);
  const { data: weekData, isLoading: weekLoading } = useWeekView(id);
  const toggleCompletion = useToggleCompletion(id);

  const habit = habitData?.habit;
  const weekDays = weekData?.week || [];

  const handleToggleDay = (date: string, isCompleted: boolean) => {
    toggleCompletion.mutate({ date, isCompleted });
  };

  // Calculate stats
  const completedThisWeek = weekDays.filter((d) => d.completed).length;
  const streakData = calculateStreakFromWeek(weekDays);

  const isLoading = habitLoading || weekLoading;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-[400px] w-full" />
      </div>
    );
  }

  if (!habit) {
    return (
      <div className="rounded-lg border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950 p-6 text-center">
        <p className="text-sm text-red-600 dark:text-red-400">
          Habit not found.
        </p>
        <Button asChild className="mt-4" variant="outline">
          <Link href="/habits">Back to Habits</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <Button
          asChild
          variant="ghost"
          className="w-fit gap-2 -ml-2"
        >
          <Link href="/habits">
            <ArrowLeft className="h-4 w-4" />
            Back to Habits
          </Link>
        </Button>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">
              {habit.name}
            </h1>
            {habit.description && (
              <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-2">
                {habit.description}
              </p>
            )}
          </div>
          <Button asChild variant="outline" className="gap-2 w-fit">
            <Link href={`/habits/${id}/stats`}>
              <BarChart3 className="h-4 w-4" />
              View Statistics
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
              This Week
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-zinc-900 dark:text-white">
              {completedThisWeek} / {habit.targetFrequency}
            </div>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1">
              days completed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
              Current Streak
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-zinc-900 dark:text-white">
              {streakData.currentStreak}
            </div>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1">
              consecutive days
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
              Target
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-zinc-900 dark:text-white">
              {habit.targetFrequency}x
            </div>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1">
              per week
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Week Calendar */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Current Week</CardTitle>
            {completedThisWeek >= habit.targetFrequency && (
              <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
                Goal Achieved!
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <WeekCalendar
            weekDays={weekDays}
            onToggleDay={handleToggleDay}
            isPending={toggleCompletion.isPending}
          />
          <div className="mt-4 text-center text-sm text-zinc-600 dark:text-zinc-400">
            Click on a day to mark it as complete or incomplete
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
