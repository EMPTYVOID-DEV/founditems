import { z } from 'zod';
import { itemMetaDataType, timeBlocks } from './consts.js';

export const itemMetaDataSchema = z
	.object({
		name: z.string(),
		type: z.enum(itemMetaDataType),
		value: z.string()
	})
	.array();

export const itemDateSchema = z.object({
	date: z.string(),
	block: z.number().min(1).max(timeBlocks)
});
