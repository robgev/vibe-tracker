import type { Request, Response, NextFunction } from 'express';
import { AppDataSource } from '../config/db';
import { HabitCompletion } from '../models/habit-completion';
import { AppError } from '../middleware/errorHandler';
import { format, isValid, parseISO } from 'date-fns';
import { getWeekDates } from '../utils/dateHelpers';
import { In } from 'typeorm';
import {
	calculateCurrentStreak,
	calculateBestStreak,
	calculateCompletionRate,
} from '../utils/streakCalculator';

const validateDate = (date?: string): string => {
	if (!date) {
		return format(new Date(), 'yyyy-MM-dd');
	}
	const parsedDate = parseISO(date);
	if (!isValid(parsedDate)) {
		throw new AppError(400, 'Invalid date format. Use YYYY-MM-DD');
	}
	return format(parsedDate, 'yyyy-MM-dd');
};

export const completeHabit = async (
	req: Request,
	res: Response,
	next: NextFunction,
): Promise<void> => {
	try {
		const { habit } = res.locals;
		const { userId } = res.locals.user;
		const { date } = req.body;

		const validatedDate = validateDate(date);

		const completionRepository = AppDataSource.getRepository(HabitCompletion);
		const existing = await completionRepository.findOne({
			where: { habitId: habit.id, userId, date: validatedDate },
		});

		if (existing) {
			res.json({ message: 'Habit already completed for this date' });
			return;
		}

		const completion = completionRepository.create({
			habitId: habit.id,
			userId,
			date: validatedDate,
		});

		await completionRepository.save(completion);

		res.status(201).json({ message: 'Habit marked as complete', completion });
	} catch (error) {
		next(error);
	}
};

export const uncompleteHabit = async (
	req: Request,
	res: Response,
	next: NextFunction,
): Promise<void> => {
	try {
		const { habit } = res.locals;
		const { userId } = res.locals.user;
		const { date } = req.body;

		const validatedDate = validateDate(date);

		const completionRepository = AppDataSource.getRepository(HabitCompletion);
		const completion = await completionRepository.findOne({
			where: { habitId: habit.id, userId, date: validatedDate },
		});

		if (!completion) {
			throw new AppError(404, 'Completion not found for this date');
		}

		await completionRepository.remove(completion);

		res.json({ message: 'Completion removed successfully' });
	} catch (error) {
		next(error);
	}
};

export const getWeekView = async (
	req: Request,
	res: Response,
	next: NextFunction,
): Promise<void> => {
	try {
		const { habit } = res.locals;
		const { userId } = res.locals.user;

		const weekDates = getWeekDates();

		const completionRepository = AppDataSource.getRepository(HabitCompletion);
		const completions = await completionRepository.find({
			where: {
				habitId: habit.id,
				userId,
				date: In(weekDates),
			},
		});

		const completionSet = new Set(completions.map((c) => c.date));
		const week = weekDates.map((date) => ({
			date,
			completed: completionSet.has(date),
		}));

		res.json({ week });
	} catch (error) {
		next(error);
	}
};

export const getHabitStatistics = async (
	req: Request,
	res: Response,
	next: NextFunction,
): Promise<void> => {
	try {
		const { habit } = res.locals;
		const { userId } = res.locals.user;

		const completionRepository = AppDataSource.getRepository(HabitCompletion);
		const completions = await completionRepository.find({
			where: { habitId: habit.id, userId },
		});

		const currentStreak = calculateCurrentStreak(
			completions,
			habit.targetFrequency,
		);
		const bestStreak = calculateBestStreak(completions, habit.targetFrequency);
		const completionRate = calculateCompletionRate(
			completions,
			habit.targetFrequency,
		);
		const totalCompletions = completions.length;

		res.json({
			statistics: {
				currentStreak,
				bestStreak,
				completionRate,
				totalCompletions,
			},
		});
	} catch (error) {
		next(error);
	}
};
