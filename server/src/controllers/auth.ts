import type { Request, Response } from 'express';
import argon2 from 'argon2';
import jwt from 'jsonwebtoken';
import { AppDataSource } from '../config/db';
import { User } from '../models/user';
import { env } from '../config/env';

const userRepository = AppDataSource.getRepository(User);

export interface JwtPayload {
	userId: string;
	email: string;
}

export const register = async (req: Request, res: Response): Promise<void> => {
	try {
		const { email, password } = req.body;

		if (!email || !password) {
			res.status(400).json({ error: 'Email and password are required' });
			return;
		}

		const existingUser = await userRepository.findOne({ where: { email } });
		if (existingUser) {
			res.status(409).json({ error: 'User already exists' });
			return;
		}

		const passwordHash = await argon2.hash(password);

		const user = userRepository.create({
			email,
			passwordHash,
		});

		await userRepository.save(user);

		const token = jwt.sign(
			{ userId: user.id, email: user.email },
			env.jwt.secret,
			{ expiresIn: env.jwt.expiresIn } as jwt.SignOptions,
		);

		res.status(201).json({
			message: 'User registered successfully',
			token,
			user: {
				id: user.id,
				email: user.email,
			},
		});
	} catch (error) {
		console.error('Registration error:', error);
		res.status(500).json({ error: 'Internal server error' });
	}
};

export const login = async (req: Request, res: Response): Promise<void> => {
	try {
		const { email, password } = req.body;

		if (!email || !password) {
			res.status(400).json({ error: 'Email and password are required' });
			return;
		}

		const user = await userRepository.findOne({
			where: { email },
			select: ['id', 'email', 'passwordHash'],
		});

		if (!user) {
			res.status(401).json({ error: 'Invalid credentials' });
			return;
		}

		const isValidPassword = await argon2.verify(user.passwordHash, password);

		if (!isValidPassword) {
			res.status(401).json({ error: 'Invalid credentials' });
			return;
		}

		const token = jwt.sign(
			{ userId: user.id, email: user.email },
			env.jwt.secret,
			{ expiresIn: env.jwt.expiresIn } as jwt.SignOptions,
		);

		res.status(200).json({
			message: 'Login successful',
			token,
			user: {
				id: user.id,
				email: user.email,
			},
		});
	} catch (error) {
		console.error('Login error:', error);
		res.status(500).json({ error: 'Internal server error' });
	}
};
