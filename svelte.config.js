import adapter from '@sveltejs/adapter-auto';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: vitePreprocess(),
	kit: {
		adapter: adapter(),
		alias: {
			'@components': './src/lib/client/components',
			'@icons': './src/lib/client/icons',
			'@server': './src/lib/server',
			'@client': './src/lib/client',
			'@shared': './src/lib/shared',
			'@assets': './src/lib/assets'
		}
	}
};

export default config;
