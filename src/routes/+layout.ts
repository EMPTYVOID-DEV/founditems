import type { Load } from '@sveltejs/kit';
import type { SessionValidationResult } from '$lib/shared/types';
import { setLL, setSvelteLL } from '@shared/i18n/i18n';
import type { Locales } from '@shared/i18n/i18n-types';

export const load: Load = async ({ data }) => {
	const { locale, user } = data as { user: SessionValidationResult['user']; locale: Locales };
	setLL(locale);
	setSvelteLL(locale);
	return { user };
};
