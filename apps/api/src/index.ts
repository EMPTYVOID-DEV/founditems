import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { env } from '@shared/env.js';
import { logger } from 'hono/logger';
import { serveAvatars, serveCategories, serveProofs } from './handlers/serveStatic.js';
import storeRoute from '@routes/store.js';

const app = new Hono();

app.onError((err, c) => {
	console.log(err);
	return c.newResponse('Service Unavailable', 500);
});

app.use(logger());

app.get('/avatars/:avatar', serveAvatars);

app.get('/categories/:category', serveCategories);

app.get('/proofs/:proof', serveProofs);

app.route('/store', storeRoute);

serve({
	fetch: app.fetch,
	port: env.PORT
});
