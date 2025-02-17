import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { env } from '@shared/env.js';
import uploadRoute from '@routes/upload.js';
import { logger } from 'hono/logger';
import { serveAvatars, serveCategories } from './handlers/serveStatic.js';

const app = new Hono();

app.onError((err, c) => {
	console.log(err);
	return c.newResponse('Service Unavailable', 500);
});

app.use(logger());

app.get('/avatars/:publicId', serveAvatars);

app.get('/categories/:category', serveCategories);

app.route('/upload', uploadRoute);

serve({
	fetch: app.fetch,
	port: env.PORT
});
