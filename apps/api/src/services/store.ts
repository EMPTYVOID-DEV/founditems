import { Hono } from 'hono';
import { unlink } from 'fs/promises';
import path from 'path';
import { env } from '@shared/env.js';
import { avatarsStorage, proofsStorage } from '@shared/consts.js';
import { storeFile } from '@utils/fs.js';
import { db, eq, itemTable } from 'db';

const route = new Hono();

route.post('/avatars', async (c) => {
	const fd = await c.req.formData();
	const file = fd.get('avatar')?.valueOf() as File;
	const filename = await storeFile(file, avatarsStorage);
	return c.json({ filename });
});

route.post('/proofs', async (c) => {
	const fd = await c.req.formData();
	const proofs = fd.getAll('proofs') as File[];
	const filenames: string[] = [];
	for (const proof of proofs) {
		const filename = await storeFile(proof, proofsStorage);
		filenames.push(filename);
	}
	return c.json({ filenames: filenames });
});

route.delete('/avatars/:filename', async (c) => {
	const filename = c.req.param('filename');
	const filePath = path.join(env.ROOT_DIR, avatarsStorage, filename);
	await unlink(filePath);
	return c.newResponse('', 200);
});

route.delete('/proofs/:itemId', async (c) => {
	const itemId = c.req.param('itemId');
	const item = (await db.query.itemTable.findFirst({
		where: eq(itemTable.id, parseInt(itemId)),
		columns: { images: true }
	}))!;
	for (const image of item.images) {
		const imagePath = path.join(env.ROOT_DIR, proofsStorage, image);
		await unlink(imagePath);
	}
	return c.newResponse('', 200);
});

export default route;
