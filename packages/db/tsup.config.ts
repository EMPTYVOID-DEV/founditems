import { defineConfig } from 'tsup';

export default defineConfig(() => ({
	entry: ['./src/index.ts', './src/migrator.ts'],
	dts: true,
	outDir: 'dist',
	format: ['esm'],
	name: 'bundle',
	splitting: false,
	sourcemap: true,
	target: 'esnext',
	clean: true,
	minify: true,
	metafile: false
}));
