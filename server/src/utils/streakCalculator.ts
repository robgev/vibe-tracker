import { startOfWeek, parseISO, format, isBefore, startOfDay } from 'date-fns';
import type { HabitCompletion } from '../models/habit-completion';

interface WeekData {
	weekStart: string;
	count: number;
}

const groupByWeek = (completions: HabitCompletion[]): Map<string, number> => {
	const weekMap = new Map<string, number>();

	for (const completion of completions) {
		const date = parseISO(completion.date);
		const weekStart = format(startOfWeek(date, { weekStartsOn: 1 }), 'yyyy-MM-dd');
		weekMap.set(weekStart, (weekMap.get(weekStart) || 0) + 1);
	}

	return weekMap;
};

const getConsecutiveWeeks = (
	weeks: WeekData[],
	targetFrequency: number,
	startFromEnd = true,
): number => {
	if (weeks.length === 0) return 0;

	const sortedWeeks = [...weeks].sort((a, b) =>
		a.weekStart.localeCompare(b.weekStart),
	);

	if (startFromEnd) {
		sortedWeeks.reverse();
	}

	let streak = 0;
	for (const week of sortedWeeks) {
		if (week.count >= targetFrequency) {
			streak++;
		} else {
			break;
		}
	}

	return streak;
};

export const calculateCurrentStreak = (
	completions: HabitCompletion[],
	targetFrequency: number,
): number => {
	const weekMap = groupByWeek(completions);
	const currentWeekStart = format(
		startOfWeek(new Date(), { weekStartsOn: 1 }),
		'yyyy-MM-dd',
	);

	const weeks: WeekData[] = [];
	for (const [weekStart, count] of weekMap) {
		if (weekStart <= currentWeekStart) {
			weeks.push({ weekStart, count });
		}
	}

	return getConsecutiveWeeks(weeks, targetFrequency, true);
};

export const calculateBestStreak = (
	completions: HabitCompletion[],
	targetFrequency: number,
): number => {
	const weekMap = groupByWeek(completions);
	const weeks: WeekData[] = Array.from(weekMap.entries())
		.map(([weekStart, count]) => ({ weekStart, count }))
		.sort((a, b) => a.weekStart.localeCompare(b.weekStart));

	let maxStreak = 0;
	let currentStreak = 0;

	for (const week of weeks) {
		if (week.count >= targetFrequency) {
			currentStreak++;
			maxStreak = Math.max(maxStreak, currentStreak);
		} else {
			currentStreak = 0;
		}
	}

	return maxStreak;
};

export const calculateCompletionRate = (
	completions: HabitCompletion[],
	targetFrequency: number,
	weeks = 4,
): number => {
	const weekMap = groupByWeek(completions);
	const currentWeekStart = format(
		startOfWeek(new Date(), { weekStartsOn: 1 }),
		'yyyy-MM-dd',
	);

	let totalCompletions = 0;
	let weeksIncluded = 0;

	const sortedWeeks = Array.from(weekMap.entries())
		.map(([weekStart, count]) => ({ weekStart, count }))
		.sort((a, b) => b.weekStart.localeCompare(a.weekStart));

	for (const week of sortedWeeks) {
		if (week.weekStart <= currentWeekStart && weeksIncluded < weeks) {
			totalCompletions += week.count;
			weeksIncluded++;
		}
	}

	if (weeksIncluded === 0) return 0;

	const targetTotal = targetFrequency * weeksIncluded;
	return Math.round((totalCompletions / targetTotal) * 100);
};
