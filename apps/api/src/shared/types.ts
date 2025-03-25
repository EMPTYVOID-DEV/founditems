export type HttpError = { status: number; statusText: string };

export type CycleAction = { type: 'unmatch' | 'match'; lostItemId: number; foundItemId: number };

export type SignalSubscriber = () => void;

export type Signal<T> = { value: T };
