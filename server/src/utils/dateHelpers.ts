import {
	startOfWeek,
	endOfWeek,
	eachDayOfInterval,
	format,
	parseISO,
} from 'date-fns';

export const getWeekDates = (date: string | Date = new Date()): string[] => {
	const targetDate = typeof date === 'string' ? parseISO(date) : date;
	const start = startOfWeek(targetDate, { weekStartsOn: 1 });
	const end = endOfWeek(targetDate, { weekStartsOn: 1 });

	return eachDayOfInterval({ start, end }).map((d) =>
		format(d, 'yyyy-MM-dd'),
	);
};
