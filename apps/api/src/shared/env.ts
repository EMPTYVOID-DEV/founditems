import { z } from 'zod';
import dotenv from 'dotenv';

dotenv.config();

const envSchema = z.object({
	ROOT_DIR: z.string({
		required_error: 'Root directory path is required'
	}),

	NODE_ENV: z.enum(['dev', 'prod', 'test']).default('dev'),

	DATABASE_URL: z
		.string({
			required_error: 'Database URL is required'
		})
		.url({
			message: 'Invalid database URL format'
		}),

	DATE_MATCHING_THRESHOLD: z.coerce
		.number()
		.int()
		.min(2)
		.max(48)
		.default(12)
		.describe('This it max hours threshold between found and lost date'),

	LIBRE_TRANSLATION_ENDPOINT: z
		.string({ required_error: 'You must set translation host' })
		.url()
		.default('http://localhost:5000/translate'),

	XENOVA_MODEL: z.string().default('Xenova/all-MiniLM-L6-v2'),

	TEXT_SIMILARITY_THRESHOLD: z.coerce
		.number()
		.max(1)
		.min(0)
		.default(0.5)
		.describe('The threshold of similarity that text matching needs to match'),

	PORT: z.coerce
		.number()
		.int()
		.min(1, 'Port must be greater than 0')
		.max(65535, 'Port must be less than or equal to 65535')
		.default(3001)
});

export const env = envSchema.parse(process.env);
