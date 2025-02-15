import type { z } from 'zod';
import { itemDateSchema, itemMetaDataSchema } from './zod.js';

export type ItemStates = 'Idle' | 'Matched';

export type ConnectionStates =
	| 'Idle'
	| 'Validated'
	| 'Payment Validated'
	| 'Payment Failed'
	| 'Shipment Processing'
	| 'Shipment Failed'
	| 'Shipment Delivered'
	| 'Reporting'
	| 'Released';

export type ConnectionMetaData = Partial<Record<ConnectionStates, unknown>>;

export type ItemDate = z.infer<typeof itemDateSchema>;

export type ItemMetaData = z.infer<typeof itemMetaDataSchema>;

export type MetaDataDesc = { name: string; type: 'select' | 'text' | 'date'; options?: string }[];

export type MetaDataDescOptions = {
	name: string;
	type: 'select' | 'text' | 'date';
	options?: string[];
}[];
