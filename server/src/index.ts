import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { AppDataSource } from './config/db';
import { env } from './config/env';
import authRoutes from './routes/auth';
import habitRoutes from './routes/habits';
import { errorHandler } from './middleware/errorHandler';

const main = async () => {
	try {
		await AppDataSource.initialize();
		console.log('Data Source has been initialized!');
	} catch (err) {
		console.error('Error during Data Source initialization:', err);
	}

	const app = express();

	app
		.use(cors())
		.use(helmet())
		.use(express.json())
		.use('/api/auth', authRoutes)
		.use('/api/habits', habitRoutes)
		.get('/health', (_, res) => {
			res.send('Habit Tracker API is running!');
		})
		.use(errorHandler)
		.listen(env.server.port, () => {
			console.log(`Server running on http://localhost:${env.server.port}`);
		});
};

main().catch(console.error);
