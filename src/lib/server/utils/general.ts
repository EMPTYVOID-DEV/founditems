import type { HttpError } from '@server/types';
import { left, right, type Either } from 'fp-ts/lib/Either';

export const checkPath = (
	pathname: string,
	options: string[],
	type: 'startWith' | 'endWith' | 'included'
) => {
	for (const option of options) {
		if (type == 'startWith' && pathname.startsWith(option)) return true;
		if (type == 'endWith' && pathname.endsWith(option)) return true;
		if (type == 'included' && pathname.includes(option)) return true;
	}
	return false;
};

export async function handleFetchError(
	call: Promise<Response>
): Promise<Either<HttpError, Response>> {
	try {
		const res = await call;
		if (!res.ok) throw new Error('Error', { cause: { res } });
		return right(res);
	} catch (error) {
		const errorObj = error as { cause: { res: Response } };
		if (errorObj?.cause?.res)
			return left({ status: errorObj.cause.res.status, statusText: errorObj.cause.res.statusText });
		return left({ status: 500, statusText: 'Internal server error' });
	}
}
