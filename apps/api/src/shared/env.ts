import { z } from 'zod';
import dotenv from 'dotenv';

dotenv.config();

const envSchema = z.object({
	ROOT_DIR: z.string({
		required_error: 'Root directory path is required'
	}),

	NODE_ENV: z.enum(['dev', 'prod', 'test']),

	DATABASE_URL: z
		.string({
			required_error: 'Database URL is required'
		})
		.url({
			message: 'Invalid database URL format'
		}),

	PORT: z.coerce
		.number()
		.int()
		.min(1, 'Port must be greater than 0')
		.max(65535, 'Port must be less than or equal to 65535')
});

export const env = envSchema.parse(process.env);
