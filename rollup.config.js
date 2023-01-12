import autoprefixer from 'autoprefixer'
import cssnano from 'cssnano'
import postcss from 'postcss'
import sass from 'rollup-plugin-sass'
import uglify from '@lopatnov/rollup-plugin-uglify'

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

export default [
	{
		input: 'src/scrollerful.js',
		output: [
			{
				file: 'dist/scrollerful.cjs',
				format: 'umd',
				name: 'scrollerful',
			},
			{
				file: 'dist/scrollerful.mjs',
				format: 'es',
			},
		],
		plugins: [sassPlugin],
		watch: {
			clearScreen: false,
		},
	},
	{
		input: 'src/scrollerful.js',
		output: [
			{
				compact: true,
				file: 'dist/scrollerful.min.js',
				format: 'umd',
				name: 'scrollerful',
			},
			{
				compact: true,
				file: 'dist/scrollerful.min.mjs',
				format: 'es',
			},
		],
		plugins: [sassPlugin, uglifyPlugin],
		watch: {
			clearScreen: false,
		},
	},
	{
		input: 'src/auto.js',
		output: {
			compact: true,
			file: 'dist/scrollerful-auto.min.js',
			format: 'umd',
			name: 'scrollerful',
		},
		plugins: [sassPlugin, uglifyPlugin],
		watch: {
			clearScreen: false,
		},
	},
	{
		input: 'assets/js/index.js',
		output: {
			file: '.build/js/scrollerful/script.js',
			format: 'umd',
			name: 'scrollerful',
		},
		plugins: [sassPlugin, uglifyPlugin],
		watch: {
			clearScreen: false,
		},
	},
]
