import type { Request, Response, NextFunction } from 'express';
import { AppDataSource } from '../config/db';
import { Habit } from '../models/habit';
import { AppError } from './errorHandler';

// Middleware to verify habit ownership
// Requires authenticate middleware to run first
export const authorizeHabitOwner = async (
	req: Request,
	res: Response,
	next: NextFunction,
): Promise<void> => {
	try {
		const habitId = req.params.id;
		const userId = res.locals.user.userId;

		if (!habitId) {
			throw new AppError(400, 'Habit ID is required');
		}

		const habitRepository = AppDataSource.getRepository(Habit);
		const habit = await habitRepository.findOne({
			where: { id: habitId },
		});

		if (!habit) {
			throw new AppError(404, 'Habit not found');
		}

		if (habit.userId !== userId) {
			throw new AppError(403, 'Access denied');
		}

		// Store habit in res.locals for controller use
		res.locals.habit = habit;
		next();
	} catch (error) {
		next(error);
	}
};
