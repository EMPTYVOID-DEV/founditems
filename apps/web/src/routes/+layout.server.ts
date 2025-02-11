import type { ServerLoad } from '@sveltejs/kit';

export const load: ServerLoad = async ({ locals }) => {
	return { user: locals.user, locale: locals.locale };
};
