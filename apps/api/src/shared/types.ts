import type { Item } from 'db';

export type HttpError = { status: number; statusText: string };

export type CycleAction = { type: 'unmatch' | 'match'; lostItemId: number; foundItemId: number };

export type MatchingPair = { foundItem: Item; lostItem: Item };
