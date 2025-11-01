import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import type { JwtPayload } from '../controllers/auth';

export const authenticate = (
	req: Request,
	res: Response,
	next: NextFunction,
): void => {
	try {
		const authHeader = req.headers.authorization;

		if (!authHeader) {
			res.status(401).json({ error: 'No authorization header provided' });
			return;
		}

		const parts = authHeader.split(' ');

		if (parts.length !== 2 || parts[0] !== 'Bearer') {
			res.status(401).json({ error: 'Invalid authorization header format' });
			return;
		}

		const token = parts[1];

		const payload = jwt.verify(token, env.jwt.secret) as JwtPayload;

		res.locals.user = payload;

		next();
	} catch (error) {
		if (error instanceof jwt.JsonWebTokenError) {
			res.status(401).json({ error: 'Invalid token' });
			return;
		}
		if (error instanceof jwt.TokenExpiredError) {
			res.status(401).json({ error: 'Token expired' });
			return;
		}
		res.status(500).json({ error: 'Internal server error' });
	}
};
