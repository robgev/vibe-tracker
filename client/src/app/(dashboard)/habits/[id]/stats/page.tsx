"use client";

import { ArrowLeft, Calendar, Target, TrendingUp } from "lucide-react";
import Link from "next/link";
import { use } from "react";
import { CompletionHeatmap } from "@/components/stats/completion-heatmap";
import { StreakDisplay } from "@/components/stats/streak-display";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useHabit, useWeekView } from "@/lib/hooks/use-habits";
import {
  calculateCompletionRate,
  calculateStreakFromWeek,
} from "@/lib/utils/streak-calculator";

interface StatsPageProps {
  params: Promise<{ id: string }>;
}

export default function HabitStatsPage({ params }: StatsPageProps) {
  const { id } = use(params);
  const { data: habitData, isLoading: habitLoading } = useHabit(id);
  const { data: weekData, isLoading: weekLoading } = useWeekView(id);

  const habit = habitData?.habit;
  const weekDays = weekData?.week || [];

  // Calculate statistics
  const completedDates = weekDays.filter((d) => d.completed).map((d) => d.date);
  const streakData = calculateStreakFromWeek(weekDays);
  const completionRate = calculateCompletionRate(
    completedDates,
    habit?.targetFrequency || 7,
  );
  const completedThisWeek = completedDates.length;

  const isLoading = habitLoading || weekLoading;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-64" />
        <div className="grid gap-4 sm:grid-cols-3">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
        <Skeleton className="h-[400px]" />
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
        <Button asChild variant="ghost" className="w-fit gap-2 -ml-2">
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
            <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-2">
              Statistics and performance insights
            </p>
          </div>
          <Button asChild variant="outline" className="gap-2 w-fit">
            <Link href={`/habits/${id}/week`}>
              <Calendar className="h-4 w-4" />
              Week View
            </Link>
          </Button>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Completion Rate
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-zinc-900 dark:text-white">
              {completionRate.toFixed(0)}%
            </div>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1">
              last 30 days
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Week</CardTitle>
            <Calendar className="h-4 w-4 text-purple-500" />
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
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Target</CardTitle>
            <Target className="h-4 w-4 text-green-500" />
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

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Status</CardTitle>
          </CardHeader>
          <CardContent>
            {completedThisWeek >= habit.targetFrequency ? (
              <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
                On Track
              </Badge>
            ) : (
              <Badge variant="secondary">
                {habit.targetFrequency - completedThisWeek} more needed
              </Badge>
            )}
            <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1">
              this week
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Streak Stats */}
      <StreakDisplay streakData={streakData} />

      {/* Completion Heatmap */}
      <CompletionHeatmap completedDates={completedDates} monthsToShow={6} />

      {/* Additional Info */}
      {habit.description && (
        <Card>
          <CardHeader>
            <CardTitle>About This Habit</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              {habit.description}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
