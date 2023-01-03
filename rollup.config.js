import sass from 'rollup-plugin-sass'

export default {
	input: 'source/js/index.js',
	output: {
		compact: true,
		file: 'source/scrollerful/js/script.js',
		format: 'iife',
	},
	plugins: [sass()],
}
