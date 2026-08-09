// @ts-check
import { defineConfig } from 'astro/config'
import compressor from 'astro-compressor'
import minifyHtml from 'astro-minify-html'

export default defineConfig({
	outDir: './deploy/public',
	srcDir: './src',
	site: 'https://remino.net/scrollerful/',
	trailingSlash: 'always',
	integrations: [
		minifyHtml({
			collapseWhitespace: true,
			removeComments: true,
			minifyCSS: true,
			minifyJS: true,
		}),
		compressor({
			zstd: false,
			fileExtensions: [
				'.css',
				'.js',
				'.html',
				'.xml',
				'.cjs',
				'.mjs',
				'.svg',
				'.txt',
			],
		}),
	],
	build: {
		assets: 'scrollerful',
	},
})
