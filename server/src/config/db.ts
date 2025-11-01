import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { User } from '../models/user';
import { Habit } from '../models/habit';
import { HabitCompletion } from '../models/habit-completion';
import { env } from './env';

export const AppDataSource = new DataSource({
	type: 'postgres',
	host: env.database.host,
	port: env.database.port,
	username: env.database.username,
	password: env.database.password,
	database: env.database.database,
	// TODO: DEV only: auto-creates schema. Use migrations in PROD.
	synchronize: true,
	logging: false,
	entities: [User, Habit, HabitCompletion],
	migrations: [],
	subscribers: [],
});
