import { avatarsStorage, categoryStorge } from '@shared/consts.js';
import { createReadStream } from 'fs';
import type { Handler } from 'hono';
import { stream } from 'hono/streaming';
import path from 'path';
import { env } from '@shared/env.js';
import { Readable } from 'stream';
import { access } from 'fs/promises';

export const serveAvatars: Handler = async (c) => {
	const publicId = c.req.param('publicId');
	const filePath = path.join(env.ROOT_DIR, avatarsStorage, publicId);
	try {
		await access(filePath);
		return stream(c, async (stream) => {
			const nodeStream = createReadStream(filePath);
			const webStream = Readable.toWeb(nodeStream);
			await stream.pipe(webStream);
		});
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
	} catch (error) {
		return c.notFound();
	}
};

export const serveCategories: Handler = async (c) => {
	const category = c.req.param('category');
	const filePath = path.join(env.ROOT_DIR, categoryStorge, category);
	try {
		await access(filePath);
		return stream(c, async (stream) => {
			const nodeStream = createReadStream(filePath);
			const webStream = Readable.toWeb(nodeStream);
			await stream.pipe(webStream);
		});
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
	} catch (error) {
		return c.notFound();
	}
};
