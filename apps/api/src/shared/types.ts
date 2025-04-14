import type { Item } from 'db';

export type HttpError = { status: number; statusText: string };

export type CycleAction =
	| { type: 'unmatch'; lostItemId: number; foundItemId: number }
	| { type: 'match'; lostItemId: number; foundItemId: number; founderId: string; victimId: string };

export type MatchingPair = { foundItem: Item; lostItem: Item };
