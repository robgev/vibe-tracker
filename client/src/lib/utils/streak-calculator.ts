import { differenceInDays, format, isToday, parseISO, subDays } from "date-fns";
import type { StreakData, WeekDay } from "../api/types";

/**
 * Calculate streak data from an array of week days
 */
export function calculateStreakFromWeek(weekDays: WeekDay[]): StreakData {
  const completedDates = weekDays
    .filter((day) => day.completed)
    .map((day) => day.date)
    .sort();

  return calculateStreakFromDates(completedDates);
}

/**
 * Calculate streak data from an array of completion date strings (YYYY-MM-DD)
 */
export function calculateStreakFromDates(
  completedDates: string[],
): StreakData {
  if (completedDates.length === 0) {
    return {
      currentStreak: 0,
      bestStreak: 0,
      longestStreak: 0,
    };
  }

  const sortedDates = [...completedDates].sort();
  const today = format(new Date(), "yyyy-MM-dd");

  // Calculate current streak (working backwards from today)
  let currentStreak = 0;
  let checkDate = today;

  // Check if today or yesterday is completed (streak can continue if missed today)
  const hasToday = sortedDates.includes(today);
  const yesterday = format(subDays(new Date(), 1), "yyyy-MM-dd");
  const hasYesterday = sortedDates.includes(yesterday);

  if (hasToday) {
    currentStreak = 1;
    checkDate = yesterday;
  } else if (hasYesterday) {
    currentStreak = 1;
    checkDate = format(subDays(new Date(), 2), "yyyy-MM-dd");
  } else {
    // Streak is broken
    currentStreak = 0;
  }

  // Continue counting backwards
  if (currentStreak > 0) {
    for (let i = sortedDates.length - 1; i >= 0; i--) {
      if (sortedDates[i] === checkDate) {
        currentStreak++;
        const prevDate = parseISO(checkDate);
        checkDate = format(subDays(prevDate, 1), "yyyy-MM-dd");
      } else if (sortedDates[i] < checkDate) {
        break;
      }
    }
  }

  // Calculate all streaks to find longest
  const allStreaks: number[] = [];
  let tempStreak = 1;

  for (let i = 1; i < sortedDates.length; i++) {
    const prevDate = parseISO(sortedDates[i - 1]);
    const currDate = parseISO(sortedDates[i]);
    const daysDiff = differenceInDays(currDate, prevDate);

    if (daysDiff === 1) {
      tempStreak++;
    } else {
      allStreaks.push(tempStreak);
      tempStreak = 1;
    }
  }
  allStreaks.push(tempStreak);

  const longestStreak = Math.max(...allStreaks, 0);
  const bestStreak = Math.max(currentStreak, longestStreak);

  return {
    currentStreak,
    bestStreak,
    longestStreak,
  };
}

/**
 * Calculate completion rate for a given period
 */
export function calculateCompletionRate(
  completedDates: string[],
  targetFrequency: number,
  startDate?: Date,
  endDate?: Date,
): number {
  const end = endDate || new Date();
  const start = startDate || subDays(end, 30); // Default to last 30 days

  const daysInPeriod = differenceInDays(end, start) + 1;
  const weeksInPeriod = Math.ceil(daysInPeriod / 7);
  const expectedCompletions = weeksInPeriod * targetFrequency;

  const completionsInPeriod = completedDates.filter((date) => {
    const d = parseISO(date);
    return d >= start && d <= end;
  }).length;

  if (expectedCompletions === 0) return 0;
  return Math.min((completionsInPeriod / expectedCompletions) * 100, 100);
}

/**
 * Check if a habit was completed today
 */
export function isCompletedToday(completedDates: string[]): boolean {
  const today = format(new Date(), "yyyy-MM-dd");
  return completedDates.includes(today);
}

/**
 * Get completion status for a specific date
 */
export function isCompletedOnDate(
  completedDates: string[],
  date: string | Date,
): boolean {
  const dateStr =
    typeof date === "string" ? date : format(date, "yyyy-MM-dd");
  return completedDates.includes(dateStr);
}

/**
 * Format streak count for display
 */
export function formatStreakCount(count: number): string {
  if (count === 0) return "No streak";
  if (count === 1) return "1 day";
  return `${count} days`;
}
