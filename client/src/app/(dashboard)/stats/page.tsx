"use client";

import { BarChart, Target, TrendingUp } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useHabits } from "@/lib/hooks/use-habits";

export default function StatsPage() {
  const { data, isLoading, error } = useHabits();

  const habits = data?.habits || [];
  const totalHabits = habits.length;
  const totalTargetDays = habits.reduce(
    (sum, habit) => sum + habit.targetFrequency,
    0,
  );
  const averageTargetFrequency = totalHabits > 0 ? totalTargetDays / totalHabits : 0;

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

  if (error) {
    return (
      <div className="rounded-lg border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950 p-6 text-center">
        <p className="text-sm text-red-600 dark:text-red-400">
          Failed to load statistics. Please try again.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">
          Statistics
        </h1>
        <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">
          Overview of all your habits and progress
        </p>
      </div>

      {/* Overview Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Habits</CardTitle>
            <BarChart className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-zinc-900 dark:text-white">
              {totalHabits}
            </div>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1">
              habits being tracked
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Weekly Target
            </CardTitle>
            <Target className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-zinc-900 dark:text-white">
              {totalTargetDays}
            </div>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1">
              total days per week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Average Frequency
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-zinc-900 dark:text-white">
              {averageTargetFrequency.toFixed(1)}x
            </div>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1">
              days per week
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Habits List with Stats */}
      {habits.length === 0 ? (
        <Card>
          <CardContent className="py-12">
            <div className="text-center">
              <BarChart className="mx-auto h-12 w-12 text-zinc-400" />
              <h3 className="mt-4 text-lg font-semibold text-zinc-900 dark:text-white">
                No habits yet
              </h3>
              <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                Create some habits to see your statistics here.
              </p>
              <Button asChild className="mt-4">
                <Link href="/habits">Go to Habits</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>All Habits</CardTitle>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              Click on a habit to view detailed statistics
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {habits.map((habit) => (
                <Link
                  key={habit.id}
                  href={`/habits/${habit.id}/stats`}
                  className="block group"
                >
                  <div className="flex items-center justify-between p-4 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors">
                    <div className="flex-1">
                      <h3 className="font-medium text-zinc-900 dark:text-white group-hover:text-zinc-700 dark:group-hover:text-zinc-200">
                        {habit.name}
                      </h3>
                      {habit.description && (
                        <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1 line-clamp-1">
                          {habit.description}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-3 ml-4">
                      <Badge variant="secondary" className="text-xs">
                        {habit.targetFrequency}x / week
                      </Badge>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="gap-2"
                        asChild
                      >
                        <span>
                          View Stats
                          <BarChart className="h-4 w-4" />
                        </span>
                      </Button>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
