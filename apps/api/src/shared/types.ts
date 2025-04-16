import type { Item } from 'db';

export type HttpError = { status: number; statusText: string };

export type CycleAction =
	| { type: 'unmatch'; lostItemId: string; foundItemId: string }
	| { type: 'match'; lostItemId: string; foundItemId: string; finderId: string; victimId: string };

export type MatchingPair = { foundItem: Item; lostItem: Item };
