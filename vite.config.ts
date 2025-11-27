import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

const repository = 'text-adventure-thing';
const isProduction = process.env.NODE_ENV === 'production';

const base = isProduction ? `/${repository}/` : '';

export default defineConfig({
	plugins: [tailwindcss(), sveltekit()],
	build: {
		outDir: 'dist', // GitHub Pages-friendly
	},
	base: base,
});
