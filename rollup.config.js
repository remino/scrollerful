import autoprefixer from 'autoprefixer'
import cssnano from 'cssnano'
import { readFileSync } from 'fs'
import postcss from 'postcss'
import sass from 'rollup-plugin-sass'
import uglify from '@lopatnov/rollup-plugin-uglify'

const {
	author: { name: authorName, url: authorUrl }, license, name, version,
} = JSON.parse(readFileSync('./package.json'))

const currentYear = new Date().getFullYear()
const banner = `/*! ${name} v${version} | (c) 2022-${currentYear} ${authorName} <${authorUrl}> | ${license} Licence */`
const output = { banner }
const outputCompact = { ...output, compact: true }

const sassPlugin = sass({
	options: {
		outputStyle: 'compressed',
	},
	processor: css => postcss([autoprefixer, cssnano])
		.process(css, { from: undefined })
		.then(result => result.css),
})

const uglifyPlugin = uglify({
	compress: {
		passes: 2,
	},
	toplevel: true,
})

const options = {
	plugins: [sassPlugin],
	watch: {
		clearScreen: false,
	},
}

const pluginsCompact = [sassPlugin, uglifyPlugin]

export default [
	{
		...options,
		input: 'src/scrollerful.js',
		output: [
			{
				...output,
				file: 'dist/scrollerful.cjs',
				format: 'umd',
				name: 'scrollerful',
			},
			{
				...output,
				file: 'dist/scrollerful.mjs',
				format: 'es',
			},
		],
	},
	{
		...options,
		input: 'src/scrollerful.js',
		output: [
			{
				...outputCompact,
				file: 'dist/scrollerful.min.js',
				format: 'umd',
				name: 'scrollerful',
			},
			{
				...outputCompact,
				file: 'dist/scrollerful.min.mjs',
				format: 'es',
			},
		],
		plugins: pluginsCompact,
	},
	{
		...options,
		input: 'src/auto.js',
		output: {
			...outputCompact,
			file: 'dist/scrollerful-auto.min.js',
			format: 'umd',
			name: 'scrollerful',
		},
		plugins: pluginsCompact,
	},
	{
		...options,
		input: 'assets/js/index.js',
		output: {
			file: '.build/js/scrollerful/script.js',
			format: 'umd',
			name: 'scrollerful',
		},
		plugins: pluginsCompact,
	},
	{
		...options,
		input: 'assets/js/demo.js',
		output: {
			file: '.build/js/scrollerful/demo.js',
			format: 'umd',
			name: 'scrollerful',
		},
		plugins: pluginsCompact,
	},
]
