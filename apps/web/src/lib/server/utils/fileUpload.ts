import { PUBLIC_API_HOST } from '$env/static/public';
import { right } from 'fp-ts/lib/Either';
import { handleFetchError } from './general';

export async function uploadAvatar(avatar: File, oldAvatar: string) {
	if (oldAvatar != '') {
		const deleteEndPoint = `${PUBLIC_API_HOST}/upload/avatars/${oldAvatar}`;
		const fetchPromise = fetch(deleteEndPoint, { method: 'DELETE' });
		const res = await handleFetchError(fetchPromise);
		if (res._tag == 'Left') return res;
	}
	const postEndPoint = `${PUBLIC_API_HOST}/upload/avatars`;
	const fd = new FormData();
	fd.append('avatar', avatar);
	const fetchPromise = fetch(postEndPoint, { method: 'POST', body: fd });
	const res = await handleFetchError(fetchPromise);
	if (res._tag == 'Left') return res;
	const publicId = (await extractJson<{ publicId: string }>(res.right)).publicId;
	return right(publicId);
}

export async function uploadProofs(proofs: File[]) {
	const postEndpoint = `${PUBLIC_API_HOST}/upload/proofs`;
	const fd = new FormData();
	for (const proof of proofs) fd.append('proofs', proof);
	const fetchPromise = fetch(postEndpoint, { method: 'POST', body: fd });
	const res = await handleFetchError(fetchPromise);
	if (res._tag == 'Left') return res;
	const publicIds = (await extractJson<{ publicIds: string[] }>(res.right)).publicIds;
	return right(publicIds);
}

async function extractJson<T>(res: Response) {
	const obj: T = await res.json();
	return obj;
}
