import { browser } from '$app/environment';
import type { Load } from '@sveltejs/kit';
import { detectLocale } from '$lib/client/i18n/i18n-util';
import { setLang } from '$lib/client/utils';
import cookies from 'browser-cookies';

export const load: Load = async () => {
	if (browser) {
		const lang = cookies.get('lang') || '';
		const locale = detectLocale(() => [lang]);
		setLang(locale);
	}
};
