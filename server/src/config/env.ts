import dotenv from 'dotenv';

dotenv.config();

export const env = {
	database: {
		host: process.env.DB_HOST || 'localhost',
		port: Number.parseInt(process.env.DB_PORT || '5432'),
		username: process.env.DB_USERNAME || 'postgres',
		password: process.env.DB_PASSWORD || 'postgres',
		database: process.env.DB_NAME || '',
	},
	jwt: {
		secret: process.env.JWT_SECRET || 'secret',
		expiresIn: process.env.JWT_EXPIRES_IN || '7d',
	},
	server: {
		port: Number.parseInt(process.env.PORT || '3000'),
		nodeEnv: process.env.NODE_ENV || 'development',
	},
};
