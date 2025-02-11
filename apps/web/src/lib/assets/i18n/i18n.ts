import type { Locales, TranslationFunctions } from './i18n-types';
import L from './i18n-node';

export let usedLocale: Locales = 'ar';

export let LL: TranslationFunctions;

export function setLL(locale: Locales) {
	LL = L[locale];
	usedLocale = locale;
}
