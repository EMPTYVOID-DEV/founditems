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

	ADDRESS_MATCHING_THRESHOLD: z.coerce
		.number()
		.int()
		.min(0)
		.max(500)
		.default(100)
		.describe('max meter-distance threshold between lost and found address'),

	DATE_MATCHING_THRESHOLD: z.coerce
		.number()
		.int()
		.min(2)
		.max(72)
		.default(24)
		.describe('max hours threshold between found and lost date'),

	XENOVA_MODEL: z.string().default('paraphrase-multilingual-MiniLM-L12-v2'),

	TEXT_SIMILARITY_THRESHOLD: z.coerce
		.number()
		.max(1)
		.min(0)
		.default(0.5)
		.describe('The threshold of similarity that text matching needs to match'),

	ALGORITHM_BLOCK_SIZE: z.coerce
		.number()
		.min(3)
		.max(10)
		.default(4)
		.describe('Number lost items operated on in each cycle'),

	MATCHING_CYCLE_TIMEOUT: z.coerce
		.number()
		.default(5000)
		.describe('Timeout between cycles in milieseconds'),

	PORT: z.coerce
		.number()
		.int()
		.min(1, 'Port must be greater than 0')
		.max(65535, 'Port must be less than or equal to 65535')
		.default(3000)
});

export const zodEnv = envSchema.parse(process.env);
