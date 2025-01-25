import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import type { Locales } from './i18n/i18n-types';
import { setLocale } from './i18n/i18n-svelte';
import { loadLocale } from './i18n/i18n-util.sync';
import type { Languages } from '$lib/shared/types';
import cookies from 'browser-cookies';

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function detectLangDirection(locale: Locales): 'ltr' | 'rtl' {
	if (locale == 'ar') return 'rtl';
	return 'ltr';
}

export function setLang(lang: Languages) {
	document.documentElement.setAttribute('lang', lang);
	loadLocale(lang);
	setLocale(lang);
}

export function setLangCookie(lang: Languages) {
	const expirationDate = Date.now() + 1000 * 60 * 60 * 24 * 7;
	cookies.set('lang', lang, { expires: new Date(expirationDate) });
}
