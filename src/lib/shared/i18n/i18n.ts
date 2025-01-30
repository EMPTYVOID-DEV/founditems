import type { Locales, TranslationFunctions } from './i18n-types';
import L from './i18n-node';
import { writable } from 'svelte/store';

export const svelteLL = writable(L['ar']);

export let LL: TranslationFunctions;

export let usedLocale: Locales = 'ar';

export function setLL(locale: Locales) {
	LL = L[locale];
	usedLocale = locale;
}

export function setSvelteLL(locale: Locales) {
	svelteLL.set(L[locale]);
}
