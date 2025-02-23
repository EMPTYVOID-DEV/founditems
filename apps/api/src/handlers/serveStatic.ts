import { avatarsStorage, categoryStorge, proofsStorage } from '@shared/consts.js';
import type { Handler } from 'hono';
import { streamFile } from '@utils/utils.fs.js';

export const serveAvatars: Handler = async (c) => {
	const avatar = c.req.param('avatar');
	return streamFile(c, avatarsStorage, avatar);
};

export const serveCategories: Handler = async (c) => {
	const category = c.req.param('category');
	return streamFile(c, categoryStorge, category);
};

export const serveProofs: Handler = async (c) => {
	const proof = c.req.param('proof');
	return streamFile(c, proofsStorage, proof);
};
