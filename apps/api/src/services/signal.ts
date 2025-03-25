import type { SignalSubscriber, Signal } from '../shared/types.js';

let subscriber: SignalSubscriber | null = null;

export function signal<T>(value: T): Signal<T> {
	const subscribers = new Set<SignalSubscriber>();
	return {
		get value() {
			if (subscriber) subscribers.add(subscriber);
			return value;
		},
		set value(updatedValue: T) {
			value = updatedValue;
			subscribers.forEach((fn) => fn());
		}
	};
}

export function effect(fn: SignalSubscriber) {
	subscriber = fn;
	fn();
	subscriber = null;
}
