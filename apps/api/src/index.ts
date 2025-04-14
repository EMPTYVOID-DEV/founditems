import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { zodEnv } from './shared/env.js';
import { logger } from 'hono/logger';
import { serveAvatars, serveCategories, serveProofs } from './services/serveStatic.js';
import storeRoute from './services/store.js';
// import { AlgorithmCycle } from './services/algorithmCycle.js';

const app = new Hono();

// const algorithmCycle = new AlgorithmCycle();

// algorithmCycle.startAlgorithm();

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
	port: zodEnv.PORT
});
