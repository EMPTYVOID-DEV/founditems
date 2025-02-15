import { z } from 'zod';
import { itemMetaDataType, daySectionsNumber } from './consts.js';

export const itemMetaDataSchema = z
	.object({
		name: z.string(),
		type: z.enum(itemMetaDataType),
		value: z.string()
	})
	.array();

export const itemDateSchema = z.object({
	date: z.string(),
	section: z.number().min(1).max(daySectionsNumber)
});
