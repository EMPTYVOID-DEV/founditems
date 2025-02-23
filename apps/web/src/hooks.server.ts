import { redirect, type Handle } from '@sveltejs/kit';
import * as auth from '@server/utils/auth.js';
import { sessionCookieName } from '@server/const.js';
import { sequence } from '@sveltejs/kit/hooks';
import {
	authPage,
	authPasswordResetPage,
	authVerifyPage,
	connectionsPage,
	postsPage,
	profilePage
} from '@shared/const';
import { checkPath, detectLocaleDirection } from '@shared/utils';
import type { Locales } from '@assets/i18n/i18n-types';
import { isLocale } from '@assets/i18n/i18n-util';
import { setLL } from '@assets/i18n/i18n';
import { defaultLocale } from 'utils';

export function handleError({ error }) {
	console.error(error);
}

const handleAuth: Handle = async ({ event, resolve }) => {
	const sessionToken = event.cookies.get(sessionCookieName);
	if (!sessionToken) {
		event.locals.user = null;
		event.locals.session = null;
		return resolve(event);
	}

	const { session, user } = await auth.validateSessionToken(sessionToken);
	if (session) {
		auth.setSessionTokenCookie(event.cookies, sessionToken, session.expiresAt);
	} else {
		auth.deleteSessionTokenCookie(event.cookies);
	}

	event.locals.user = user;
	event.locals.session = session;

	return resolve(event);
};

const handleRouting: Handle = async ({ event, resolve }) => {
	const { user } = event.locals;
	const pathname = event.url.pathname;
	if (user && checkPath(pathname, [authPage, authVerifyPage, authPasswordResetPage], 'startWith'))
		redirect(303, profilePage);
	if (!user && checkPath(pathname, [profilePage, connectionsPage, postsPage], 'startWith'))
		redirect(303, authPage);
	return resolve(event);
};

const handleI18n: Handle = async ({ event, resolve }) => {
	let locale = event.cookies.get('lang') as Locales;
	if (!locale || !isLocale(locale)) locale = defaultLocale;
	const direction = detectLocaleDirection(locale);
	event.locals.locale = locale;
	setLL(locale);
	return resolve(event, {
		transformPageChunk: ({ html }) =>
			html.replace(/<html[^>]*>/, `<html lang="${locale}" dir="${direction}">`)
	});
};

export const handle: Handle = sequence(handleAuth, handleRouting, handleI18n);
