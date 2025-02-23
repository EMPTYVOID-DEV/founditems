import { access, writeFile } from 'fs/promises';
import { nanoid } from 'nanoid';
import path from 'path';
import { env } from '@shared/env.js';
import mime from 'mime-types';
import type { Context } from 'hono';
import { stream } from 'hono/streaming';
import { createReadStream } from 'fs';
import { Readable } from 'stream';

export async function storeFile(file: File, storage: string) {
	const arrayBuffer = await file.arrayBuffer();
	const id = nanoid(8);
	const ext = mime.extension(file.type) || 'bin';
	const filename = `${id}.${ext}`;
	const filePath = path.join(env.ROOT_DIR, storage, filename);
	await writeFile(filePath, Buffer.from(arrayBuffer));
	return filename;
}

export async function streamFile(c: Context, storage: string, filename: string) {
	const filePath = path.join(env.ROOT_DIR, storage, filename);
	try {
		await access(filePath);
		return stream(c, async (stream) => {
			const nodeStream = createReadStream(filePath);
			const webStream = Readable.toWeb(nodeStream);
			await stream.pipe(webStream);
		});
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
	} catch (_) {
		return c.notFound();
	}
}
