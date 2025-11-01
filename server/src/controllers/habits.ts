import type { Request, Response, NextFunction } from 'express';
import { AppDataSource } from '../config/db';
import { Habit } from '../models/habit';
import { HabitCompletion } from '../models/habit-completion';
import { AppError } from '../middleware/errorHandler';
import { format, isValid, parseISO } from 'date-fns';

// Validation helpers
const validateName = (name: unknown): string => {
	if (!name || typeof name !== 'string' || name.trim() === '') {
		throw new AppError(400, 'Name is required and cannot be empty');
	}
	return name.trim();
};

const validateDescription = (description: unknown): string | null => {
	if (description === undefined || description === null) {
		return null;
	}
	const trimmed = typeof description === 'string' ? description.trim() : '';
	return trimmed || null;
};

const validateTargetFrequency = (targetFrequency: unknown): number => {
	if (targetFrequency === undefined) {
		return 7;
	}
	if (typeof targetFrequency !== 'number' || !Number.isInteger(targetFrequency)) {
		throw new AppError(
			400,
			'Target frequency must be an integer between 1 and 7',
		);
	}
	if (targetFrequency < 1 || targetFrequency > 7) {
		throw new AppError(
			400,
			'Target frequency must be an integer between 1 and 7',
		);
	}
	return targetFrequency;
};

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

// List all habits for authenticated user
export const listHabits = async (
	req: Request,
	res: Response,
	next: NextFunction,
): Promise<void> => {
	try {
		const { userId } = res.locals.user;
		const { search, status } = req.query;

		const habitRepository = AppDataSource.getRepository(Habit);
		const completionRepository = AppDataSource.getRepository(HabitCompletion);

		// Build query
		const query = habitRepository
			.createQueryBuilder('habit')
			.where('habit.userId = :userId', { userId });

		// Apply search filter
		if (search && typeof search === 'string') {
			query.andWhere('habit.name ILIKE :search', {
				search: `%${search}%`,
			});
		}

		const habits = await query.orderBy('habit.createdAt', 'DESC').getMany();

		// Filter by completion status if requested
		if (status === 'completed-today') {
			const today = format(new Date(), 'yyyy-MM-dd');
			const completedToday = await completionRepository.find({
				where: { userId, date: today },
			});
			const completedHabitIds = new Set(
				completedToday.map((c) => c.habitId),
			);

			const filteredHabits = habits.filter((h) =>
				completedHabitIds.has(h.id),
			);
			res.json({ habits: filteredHabits });
			return;
		}

		res.json({ habits });
	} catch (error) {
		next(error);
	}
};

// Create new habit
export const createHabit = async (
	req: Request,
	res: Response,
	next: NextFunction,
): Promise<void> => {
	try {
		const { userId } = res.locals.user;
		const { name, description, targetFrequency } = req.body;

		const habitRepository = AppDataSource.getRepository(Habit);
		const habit = habitRepository.create({
			name: validateName(name),
			description: validateDescription(description),
			targetFrequency: validateTargetFrequency(targetFrequency),
			userId,
		});

		await habitRepository.save(habit);

		res.status(201).json({ message: 'Habit created successfully', habit });
	} catch (error) {
		next(error);
	}
};

// Update habit
export const updateHabit = async (
	req: Request,
	res: Response,
	next: NextFunction,
): Promise<void> => {
	try {
		const { habit } = res.locals;
		const { name, description, targetFrequency } = req.body;

		// Update fields if provided
		if (name !== undefined) {
			habit.name = validateName(name);
		}

		if (description !== undefined) {
			habit.description = validateDescription(description);
		}

		if (targetFrequency !== undefined) {
			habit.targetFrequency = validateTargetFrequency(targetFrequency);
		}

		const habitRepository = AppDataSource.getRepository(Habit);
		await habitRepository.save(habit);

		res.json({ message: 'Habit updated successfully', habit });
	} catch (error) {
		next(error);
	}
};

// Delete habit
export const deleteHabit = async (
	req: Request,
	res: Response,
	next: NextFunction,
): Promise<void> => {
	try {
		const { habit } = res.locals;

		const habitRepository = AppDataSource.getRepository(Habit);
		await habitRepository.remove(habit);

		res.json({ message: 'Habit deleted successfully' });
	} catch (error) {
		next(error);
	}
};
