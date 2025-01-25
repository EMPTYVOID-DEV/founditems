import { browser } from '$app/environment';
import type { Load } from '@sveltejs/kit';
import { detectLocale } from '$lib/client/i18n/i18n-util';
import { loadLocale } from '$lib/client/i18n/i18n-util.sync';
import { setLocale } from '$lib/client/i18n/i18n-svelte';
import { detectLangDirection } from '$lib/client/utils';
import cookies from 'browser-cookies';
import type { SessionValidationResult } from '$lib/shared/types';

export const load: Load = async ({ data }) => {
	if (browser) {
		const lang = cookies.get('lang') || '';
		const locale = detectLocale(() => [lang]);
		const direction = detectLangDirection(locale);
		document.documentElement.setAttribute('dir', direction);
		document.documentElement.setAttribute('lang', locale);
		loadLocale(locale);
		setLocale(locale);
	}
	return data as { user: SessionValidationResult['user'] };
};
