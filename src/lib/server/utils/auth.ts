import type { RequestEvent } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import { sha256 } from '@oslojs/crypto/sha2';
import { encodeBase64url, encodeHexLowerCase } from '@oslojs/encoding';
import { db } from '../db';
import type { Session } from '@shared/types';
import { sessionTable, userTable } from '../db/schema';
import { DAY_IN_MS, sessionCookieName } from '../const';
import { dev } from '$app/environment';

export function generateSessionToken() {
	const bytes = crypto.getRandomValues(new Uint8Array(18));
	const token = encodeBase64url(bytes);
	return token;
}

export function generateExpirationDate() {
	return new Date(Date.now() + DAY_IN_MS * 30);
}

export async function createSession(token: string, userId: string) {
	const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
	const session: Session = {
		id: sessionId,
		userId,
		expiresAt: generateExpirationDate()
	};
	await db.insert(sessionTable).values(session);
	return session;
}

export async function validateSessionToken(token: string) {
	const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
	const [result] = await db
		.select({
			user: {
				id: userTable.id,
				fullname: userTable.fullname,
				avatar: userTable.avatar,
				address: userTable.address,
				phoneNumber: userTable.phoneNumber
			},
			session: sessionTable
		})
		.from(sessionTable)
		.innerJoin(userTable, eq(sessionTable.userId, userTable.id))
		.where(eq(sessionTable.id, sessionId));

	if (!result) {
		return { session: null, user: null };
	}
	const { session, user } = result;

	const sessionExpired = Date.now() >= session.expiresAt.getTime();
	if (sessionExpired) {
		await db.delete(sessionTable).where(eq(sessionTable.id, session.id));
		return { session: null, user: null };
	}

	const renewSession = Date.now() >= session.expiresAt.getTime() - DAY_IN_MS * 15;
	if (renewSession) {
		session.expiresAt = generateExpirationDate();
		await db
			.update(sessionTable)
			.set({ expiresAt: session.expiresAt })
			.where(eq(sessionTable.id, session.id));
	}

	return { session, user };
}

export async function invalidateSession(sessionId: string) {
	await db.delete(sessionTable).where(eq(sessionTable.id, sessionId));
}

export function setSessionTokenCookie(
	cookies: RequestEvent['cookies'],
	token: string,
	expiresAt: Date
) {
	cookies.set(sessionCookieName, token, {
		expires: expiresAt,
		httpOnly: true,
		secure: !dev,
		path: '/'
	});
}

export function deleteSessionTokenCookie(cookies: RequestEvent['cookies']) {
	cookies.delete(sessionCookieName, {
		path: '/'
	});
}

export function createSessionWrapper(cookies: RequestEvent['cookies'], userId: string) {
	const token = generateSessionToken();
	const expiresAt = generateExpirationDate();
	setSessionTokenCookie(cookies, token, expiresAt);
	return createSession(token, userId);
}
