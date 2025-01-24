import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import type { Locales } from './i18n/i18n-types';
import { setLocale } from './i18n/i18n-svelte';
import { loadLocale } from './i18n/i18n-util.sync';
import cookies from 'browser-cookies';
import type { Languages } from '$lib/shared/types';

export function detectLangDirection(locale: Locales): 'ltr' | 'rtl' {
	if (locale == 'ar') return 'rtl';
	return 'ltr';
}

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function setLang(lang: Languages) {
	const direction = detectLangDirection(lang);
	document.documentElement.setAttribute('dir', direction);
	document.documentElement.setAttribute('lang', lang);
	cookies.set('lang', lang);
	loadLocale(lang);
	setLocale(lang);
}
