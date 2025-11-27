import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

const repository = 'text-adventure-thing';
const isProduction = process.env.NODE_ENV === 'production';

const base = isProduction ? `/${repository}` : '';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://svelte.dev/docs/kit/integrations
	// for more information about preprocessors
	preprocess: vitePreprocess(),

	kit: {
		// adapter-auto only supports some environments, see https://svelte.dev/docs/kit/adapter-auto for a list.
		// If your environment is not supported, or you settled on a specific environment, switch out the adapter.
		// See https://svelte.dev/docs/kit/adapters for more information about adapters.
		adapter: adapter({
			pages: 'dist',   // output folder
			assets: 'dist',
			fallback: 'index.html' // allows SPA behavior for dynamic routes
    	}),
		prerender: {
			crawl: true,
			entries: ['/'],
		},
		paths: {
			base: base
		}
	}
};

export default config;
