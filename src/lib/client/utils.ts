import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { setLocale } from './i18n/i18n-svelte';
import { loadLocale } from './i18n/i18n-util.sync';
import type { Languages } from '$lib/shared/types';
import cookies from 'browser-cookies';
import { toast } from 'svelte-sonner';
import Sonner from '@components/shadcn/sonnar/sonner.svelte';
import type { ComponentType } from 'svelte';

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function detectLangDirection(locale: Languages): 'ltr' | 'rtl' {
	if (locale == 'ar') return 'rtl';
	return 'ltr';
}

export function setLang(lang: Languages) {
	const direction = detectLangDirection(lang);
	document.documentElement.setAttribute('dir', direction);
	document.documentElement.setAttribute('lang', lang);
	loadLocale(lang);
	setLocale(lang);
}

export function setLangCookie(lang: Languages) {
	const expirationDate = Date.now() + 1000 * 60 * 60 * 24 * 7;
	cookies.set('lang', lang, { expires: new Date(expirationDate) });
}

export function showToast(title: string, message: string, state: 'error' | 'info' | 'success') {
	toast.custom(Sonner as unknown as ComponentType, {
		componentProps: {
			title,
			message,
			state
		}
	});
}
