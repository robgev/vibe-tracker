import type { Request, Response, NextFunction } from 'express';

// Custom error class for operational errors
export class AppError extends Error {
	constructor(
		public statusCode: number,
		public message: string,
		public isOperational = true,
	) {
		super(message);
		Object.setPrototypeOf(this, AppError.prototype);
	}
}

// Global error handler middleware - must be placed last in Express chain
export const errorHandler = (
	err: Error | AppError,
	req: Request,
	res: Response,
	next: NextFunction,
): void => {
	// Check if it's an operational error
	if (err instanceof AppError) {
		res.status(err.statusCode).json({
			error: err.message,
		});
		return;
	}

	// Unexpected error - log and return generic message
	console.error('Unexpected error:', err);
	res.status(500).json({
		error: 'Internal server error',
	});
};
