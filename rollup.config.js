import sass from 'rollup-plugin-sass'
import uglify from '@lopatnov/rollup-plugin-uglify'

const sassPlugin = sass({
	options: {
		outputStyle: 'compressed',
	},
})

export default [
	{
		input: 'lib/init.js',
		output: {
			compact: true,
			file: 'dist/scrollerful.js',
			format: 'iife',
		},
		plugins: [sassPlugin, uglify()],
	},
	{
		input: 'source/js/index.js',
		output: {
			compact: true,
			file: 'source/scrollerful/script.js',
			format: 'iife',
		},
		plugins: [sassPlugin, uglify()],
	},
]
