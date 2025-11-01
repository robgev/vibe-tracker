import { Award, Flame, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { StreakData } from "@/lib/api/types";
import { formatStreakCount } from "@/lib/utils/streak-calculator";

interface StreakDisplayProps {
  streakData: StreakData;
}

export function StreakDisplay({ streakData }: StreakDisplayProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Current Streak</CardTitle>
          <Flame className="h-4 w-4 text-orange-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-zinc-900 dark:text-white">
            {streakData.currentStreak}
          </div>
          <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1">
            {formatStreakCount(streakData.currentStreak)}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Best Streak</CardTitle>
          <Award className="h-4 w-4 text-yellow-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-zinc-900 dark:text-white">
            {streakData.bestStreak}
          </div>
          <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1">
            {formatStreakCount(streakData.bestStreak)}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Longest Streak</CardTitle>
          <TrendingUp className="h-4 w-4 text-blue-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-zinc-900 dark:text-white">
            {streakData.longestStreak}
          </div>
          <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1">
            {formatStreakCount(streakData.longestStreak)}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
