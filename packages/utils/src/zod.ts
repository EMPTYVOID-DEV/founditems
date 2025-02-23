import { z } from 'zod';
import { itemAddressLength, itemMetaDataType, transports } from './consts.js';

export const itemMetaDataSchema = z
	.object({
		name: z.string(),
		type: z.enum(itemMetaDataType),
		value: z.string()
	})
	.array();

export const rawAddressSchema = z.object({
	id: z.number(),
	name: z.string(),
	longtitude: z.string(),
	latitude: z.string(),
	rank: z.number().min(1).max(30)
});

export const itemAddressSchema = z
	.discriminatedUnion('type', [
		z.object({ type: z.literal('general'), address: rawAddressSchema }),
		z.object({
			type: z.literal('transport'),
			method: z.enum(transports),
			startAddress: rawAddressSchema,
			endAddress: rawAddressSchema
		})
	])
	.array()
	.max(itemAddressLength);
