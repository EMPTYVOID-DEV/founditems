import type { z } from 'zod';
import { rawAddressSchema, itemAddressSchema, itemMetaDataSchema } from './zod.js';
import type { availableLocales, transports } from './consts.js';

export type ItemStates = 'idle' | 'matched';

export type MatchStates =
	| 'idle'
	| 'validated'
	| 'payment Validated'
	| 'payment Failed'
	| 'shipment Processing'
	| 'shipment Failed'
	| 'shipment Delivered'
	| 'reporting'
	| 'released';

export type Nullable<T> = { [K in keyof T]: T[K] | null };

export type MatchMetaData = Partial<Record<MatchStates, unknown>>;

export type ItemMetaData = z.infer<typeof itemMetaDataSchema>;

export type MetaDataDesc = { name: string; type: 'select' | 'text' | 'date'; options?: string }[];

export type MetaDataDescOptions = {
	name: string;
	type: 'select' | 'text' | 'date';
	options?: string[];
}[];

export type AvailableLocales = (typeof availableLocales)[number];

export type Transports = (typeof transports)[number];

export type ItemAddress = z.infer<typeof itemAddressSchema>;

export type RawAddress = z.infer<typeof rawAddressSchema>;

export type TransportAddress = Extract<ItemAddress[number], { type: 'transport' }>;

export type ItemAddressTypes = ItemAddress[number]['type'];

export type ItemType = 'found' | 'lost';

export type NominatimResponse = {
	place_id: number;
	osm_type: string;
	osm_id: number;
	lat: string;
	lon: string;
	class: string;
	type: string;
	place_rank: number;
	importance: number;
	addresstype: string;
	name: string;
	display_name: string;
}[];
