import type { HttpError } from '../shared/types.js';
import { left, right, type Either } from 'fp-ts/lib/Either.js';

export async function extractJson<T>(res: Response) {
	const obj = (await res.json()) as T;
	return obj;
}

export async function handleFetchError(
	call: Promise<Response>
): Promise<Either<HttpError, Response>> {
	try {
		const res = await call;
		if (!res.ok) throw new Error('Error', { cause: { res } });
		return right(res);
	} catch (error) {
		if (error instanceof Error && error.cause instanceof Response)
			return left({ status: error.cause.status, statusText: error.cause.statusText });
		return left({ status: 511, statusText: 'Network Error' });
	}
}
