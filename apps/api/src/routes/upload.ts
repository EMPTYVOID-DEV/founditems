import { Hono } from 'hono';
import { unlink, writeFile } from 'fs/promises';
import mime from 'mime-types';
import { nanoid } from 'nanoid';
import path from 'path';
import { env } from '@shared/env.js';
import { avatarsStorage, proofsStorage } from '@shared/consts.js';

const route = new Hono();

route.post('/avatars', async (c) => {
	const fd = await c.req.formData();
	const file = fd.get('avatar')?.valueOf() as File;
	const arrayBuffer = await file.arrayBuffer();
	const id = nanoid(8);
	const ext = mime.extension(file.type) || 'bin';
	const publicId = `${id}.${ext}`;
	const filePath = path.join(env.ROOT_DIR, avatarsStorage, publicId);
	await writeFile(filePath, Buffer.from(arrayBuffer));
	return c.json({ publicId });
});

route.post('/proofs', async (c) => {
	const fd = await c.req.formData();
	const proofs = fd.getAll('proofs') as File[];
	const publicIds: string[] = [];
	for (const proof of proofs) {
		const arrayBuffer = await proof.arrayBuffer();
		const id = nanoid(8);
		const ext = mime.extension(proof.type) || 'bin';
		const publicId = `${id}.${ext}`;
		const filePath = path.join(env.ROOT_DIR, proofsStorage, publicId);
		await writeFile(filePath, Buffer.from(arrayBuffer));
		publicIds.push(publicId);
	}
	return c.json({ publicIds: publicIds });
});

route.delete('/avatars/:publicId', async (c) => {
	const publicId = c.req.param('publicId');
	const filePath = path.join(env.ROOT_DIR, avatarsStorage, publicId);
	await unlink(filePath);
	return c.newResponse('', 200);
});

export default route;
