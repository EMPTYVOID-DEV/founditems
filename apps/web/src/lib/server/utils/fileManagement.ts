import { PUBLIC_API_HOST } from '$env/static/public';
import { right } from 'fp-ts/lib/Either';
import { extractJson, handleFetchError } from './general';

export async function uploadAvatar(avatar: File, oldAvatar: string) {
	if (oldAvatar != '') {
		const deleteEndPoint = `${PUBLIC_API_HOST}/store/avatars/${oldAvatar}`;
		const fetchPromise = fetch(deleteEndPoint, { method: 'DELETE' });
		const res = await handleFetchError(fetchPromise);
		if (res._tag == 'Left') return res;
	}
	const postEndPoint = `${PUBLIC_API_HOST}/store/avatars`;
	const fd = new FormData();
	fd.append('avatar', avatar);
	const fetchPromise = fetch(postEndPoint, { method: 'POST', body: fd });
	const res = await handleFetchError(fetchPromise);
	if (res._tag == 'Left') return res;
	const filename = (await extractJson<{ filename: string }>(res.right)).filename;
	return right(filename);
}

export async function uploadProofs(proofs: File[]) {
	const postEndPoint = `${PUBLIC_API_HOST}/store/proofs`;
	const fd = new FormData();
	for (const proof of proofs) fd.append('proofs', proof);
	const fetchPromise = fetch(postEndPoint, { method: 'POST', body: fd });
	const res = await handleFetchError(fetchPromise);
	if (res._tag == 'Left') return res;
	const filenames = (await extractJson<{ filenames: string[] }>(res.right)).filenames;
	return right(filenames);
}

export async function deleteItemProofs(itemId: number) {
	const deleteEndPoint = `${PUBLIC_API_HOST}/store/proofs/${itemId}`;
	const fetchPromise = fetch(deleteEndPoint, { method: 'DELETE' });
	const res = await handleFetchError(fetchPromise);
	if (res._tag == 'Left') return res;
	return right(res.right);
}
