import type { Locales, TranslationFunctions } from './i18n-types';
import L from './i18n-node';
import { writable } from 'svelte/store';

export const svelteLL = writable<TranslationFunctions>(L['ar']);

export const svelteUsedLocale = writable<Locales>('ar');

export function setSvelteLL(locale: Locales) {
	svelteLL.set(L[locale]);
	svelteUsedLocale.set(locale);
}
